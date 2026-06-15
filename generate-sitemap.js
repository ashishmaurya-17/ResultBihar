import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, files_ = []) {
  if (!fs.existsSync(dir)) return files_;
  try {
    const files = fs.readdirSync(dir);
    for (const i in files) {
      const name = path.join(dir, files[i]);
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
  } catch (err) {
    console.warn(`Warning reading directory ${dir}:`, err.message);
  }
  return files_;
}

// Dynamically use APP_URL env variable or fallback to the deployment URL
const BASE_URL = process.env.APP_URL || 'https://sarkariboard.com';

// Helper to extract a YAML frontmatter attribute by key using a precise regex
function getFrontmatterValue(content, key) {
  const regex = new RegExp(`^${key}:\\s*["']?([^"'\n]+)["']?`, 'm');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

// Standardize dates to YYYY-MM-DD
function standardizeDate(rawDate) {
  if (!rawDate) return null;
  rawDate = rawDate.trim();
  if (rawDate.includes('/')) {
    const parts = rawDate.split('/');
    if (parts[2] && parts[2].length === 4) {
      // Convert standard DD/MM/YYYY or MM/DD/YYYY to YYYY-MM-DD
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }
  return null;
}

// Programmatic ping to Google Search Console via OAuth-based Search Console API
function base64url(str) {
  return str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(clientEmail, privateKey) {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not defined in this Node.js version. Skipping GSC submission.');
  }
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64'));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64'));

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  // Safe normalization of newline characters and quotes in private keys
  let formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
  if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1).replace(/\\n/g, '\n');
  }
  if (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'")) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1).replace(/\\n/g, '\n');
  }
  
  if (!formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    // Sometimes it's passed without the header/footer, add it
    formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${formattedPrivateKey}\n-----END PRIVATE KEY-----\n`;
  }
  
  let signature = '';
  try {
    signature = base64url(sign.sign(formattedPrivateKey, 'base64'));
  } catch (err) {
    throw new Error(`Decoder issue when parsing private key: ${err.message}. Ensure your GSC_PRIVATE_KEY is valid.`);
  }

  const jwt = `${header}.${payload}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google API Authentication Failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function submitToGoogleSearchConsole(currentDateStr) {
  const siteUrl = process.env.GSC_SITE_URL || BASE_URL;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  // Credentials can be provided as environment variables / secret keys
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;

  if (!clientEmail || !privateKey || privateKey.length < 50) {
    console.log('\n--- Google Search Console Programmatic Submission ---');
    console.log('ℹ️ Google Search Console API credentials were not found or are invalid (dummy key).');
    console.log('Programmatic sitemap submission skipped (credentials not provided).');
    console.log('-----------------------------------------------------\n');
    return;
  }

  console.log('\n--- Google Search Console Programmatic Submission ---');
  console.log(`Submitting sitemap URL: ${sitemapUrl}`);
  console.log(`Target verified GSC site: ${siteUrl}`);

  try {
    if (typeof fetch === 'undefined') {
      console.warn('⚠️ fetch is not defined in this Node.js runtime environment. Skipping Search Console ping.');
      console.log('-----------------------------------------------------\n');
      return;
    }
    console.log('Authenticating with Google API...');
    const token = await getAccessToken(clientEmail, privateKey);
    console.log('Authentication successful! Initializing Google Webmasters sitemap submission API call...');

    const endpoint = `https://webmasters.googleapis.com/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Length': '0'
      }
    });

    if (response.ok) {
      console.log('✅ Google Search Console was successfully pinged! Sitemap is scheduled for crawl.');
    } else {
      const errText = await response.text();
      console.warn(`⚠️ Google Search Console API submission responded with status ${response.status}:`);
      console.warn(errText);
    }
  } catch (err) {
    console.log('Google Search Console submission not completed:');
    console.log(err.message);
  }
  console.log('-----------------------------------------------------\n');
}

// Wrap sitemap writing and logic in defensive try-catch
async function main() {
  try {
    const currentDateStr = new Date().toISOString().split('T')[0];

    let sitemapLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];

    // 1. Generate URLs for core static application pages
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: 'tools', priority: '0.95', changefreq: 'weekly' },
      { path: 'faqs', priority: '0.80', changefreq: 'weekly' },
      { path: 'contact', priority: '0.70', changefreq: 'weekly' },
      { path: 'about', priority: '0.60', changefreq: 'monthly' },
      { path: 'disclaimer', priority: '0.40', changefreq: 'monthly' },
      { path: 'privacy', priority: '0.40', changefreq: 'monthly' },
      { path: 'terms', priority: '0.40', changefreq: 'monthly' }
    ];

    staticPages.forEach(p => {
      const pageUrl = p.path ? `${BASE_URL}/${p.path}` : `${BASE_URL}/`;
      sitemapLines.push('  <url>');
      sitemapLines.push(`    <loc>${pageUrl}</loc>`);
      sitemapLines.push(`    <lastmod>${currentDateStr}</lastmod>`);
      sitemapLines.push(`    <changefreq>${p.changefreq}</changefreq>`);
      sitemapLines.push(`    <priority>${p.priority}</priority>`);
      sitemapLines.push('  </url>');
    });

    // 2. Generate URLs for all dynamic markdown post bulletins
    const contentPath = path.join(__dirname, 'src', 'content');
    const mdFiles = getFiles(contentPath).filter(f => f.endsWith('.md'));

    mdFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const slug = path.basename(file, '.md');
        const postUrl = `${BASE_URL}/post/${slug}`;

        // Parse YAML attributes carefully
        const postDateRaw = getFrontmatterValue(content, 'postDate') || getFrontmatterValue(content, 'date') || '';
        const lastDateRaw = getFrontmatterValue(content, 'lastDateToApply') || getFrontmatterValue(content, 'applicationEnd') || '';
        const collection = getFrontmatterValue(content, 'collection') || 'jobs';

        const postDate = standardizeDate(postDateRaw) || currentDateStr;
        const lastDate = standardizeDate(lastDateRaw);

        let changefreq = 'weekly';
        let priority = '0.80';

        // Smart crawl budget management: downgrade priorities of expired notification listings
        const isExpired = lastDate && lastDate < currentDateStr;

        if (isExpired) {
          changefreq = 'monthly';
          priority = '0.50';
        } else {
          // Boost priorities for active live updates and job listings
          if (collection === 'jobs') {
            changefreq = 'daily';
            priority = '0.90';
          } else if (collection === 'results' || collection === 'admit-cards') {
            // Recent result releases get higher priorities
            const diffMs = Math.abs(new Date(currentDateStr) - new Date(postDate));
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays <= 30) {
              changefreq = 'daily';
              priority = '0.85';
            } else {
              changefreq = 'weekly';
              priority = '0.70';
            }
          } else {
            changefreq = 'weekly';
            priority = '0.75';
          }
        }

        sitemapLines.push('  <url>');
        sitemapLines.push(`    <loc>${postUrl}</loc>`);
        sitemapLines.push(`    <lastmod>${postDate}</lastmod>`);
        sitemapLines.push(`    <changefreq>${changefreq}</changefreq>`);
        sitemapLines.push(`    <priority>${priority}</priority>`);
        sitemapLines.push('  </url>');
      } catch (postErr) {
        console.warn(`Sitemap generation skipped file ${file} due to error:`, postErr.message);
      }
    });

    sitemapLines.push('</urlset>');

    // Generate Google News Sitemap
    let newsSitemapLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
    ];

    mdFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const slug = path.basename(file, '.md');
        const postUrl = `${BASE_URL}/post/${slug}`;

        const postDateRaw = getFrontmatterValue(content, 'postDate') || getFrontmatterValue(content, 'date') || '';
        const postDate = standardizeDate(postDateRaw) || currentDateStr;
        const collection = getFrontmatterValue(content, 'collection') || 'jobs';
        const title = getFrontmatterValue(content, 'title') || slug;

        if (['jobs', 'results', 'admit-cards'].includes(collection)) {
          const diffDays = Math.ceil(Math.abs(new Date(currentDateStr) - new Date(postDate)) / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) {
            newsSitemapLines.push('  <url>');
            newsSitemapLines.push(`    <loc>${postUrl}</loc>`);
            newsSitemapLines.push('    <news:news>');
            newsSitemapLines.push('      <news:publication>');
            newsSitemapLines.push('        <news:name>SarkariBoard</news:name>');
            newsSitemapLines.push('        <news:language>en</news:language>');
            newsSitemapLines.push('      </news:publication>');
            newsSitemapLines.push(`      <news:publication_date>${postDate}T00:00:00+00:00</news:publication_date>`);
            newsSitemapLines.push(`      <news:title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>`);
            newsSitemapLines.push('    </news:news>');
            newsSitemapLines.push('  </url>');
          }
        }
      } catch (newsErr) {
        // Safe skip single file
      }
    });

    newsSitemapLines.push('</urlset>');

    const sitemapContent = sitemapLines.join('\n');
    const newsSitemapContent = newsSitemapLines.join('\n');

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write to public/
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    fs.writeFileSync(path.join(publicDir, 'news-sitemap.xml'), newsSitemapContent);
    console.log('Sitemap built successfully at public/sitemap.xml');
    console.log('News sitemap built successfully at public/news-sitemap.xml');

    // Write to dist/ if it exists (for immediate availability in production build directory)
    const distDir = path.join(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
      fs.writeFileSync(path.join(distDir, 'news-sitemap.xml'), newsSitemapContent);
      console.log('Sitemaps successfully copied to dist/');
    }

    // Trigger Google Search Console Submission
    await submitToGoogleSearchConsole(currentDateStr);
  } catch (error) {
    console.error('⚠️ Sitemap generation encountered an error, but proceeding to allow successful build:', error);
  }
}

// Boot sitemap script
main();
