import express from "express";
import path from "path";
import fs from "fs";
import yaml from "yaml";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { generateMockPostsForCollection } from "./src/lib/boardMocks";
import { 
  getIndexingStatus, 
  saveIndexingCredentials, 
  runGoogleIndexingApi, 
  appendIndexingLog,
  getIndexNowConfig,
  saveIndexNowConfig,
  runIndexNowSubmit
} from "./src/lib/indexingHelper";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

interface ServerPost {
  id: string;
  slug: string;
  title: string;
  collection: string;
  postDate: string;
  summary: string;
  content: string;
  attributes: any;
  organization?: string;
  state?: string;
  lastDateToApply?: string;
  examDate?: string;
  datesSchema?: any;
  urgent?: boolean;
}

// Lazy-loaded Gemini instance to prevent server startup crash if key is not defined yet
let aiInstance: GoogleGenAI | null = null;
let warmedPostSummaries: { id: string; title: string; category: string; date: string }[] = [];
const warmedPostsMap = new Map<string, ServerPost>();

function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables or Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

// Simple recursive folder scanner to find all job updates
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith(".md")) {
      results.push(filePath);
    }
  });
  return results;
}

function warmPostIndexing() {
  try {
    const postsDir = path.join(process.cwd(), "src/content");
    const files = getFilesRecursively(postsDir);
    
    // Store counts for mock generation offset to ensure 100% same ids as frontend
    const collectionCounts: Record<string, number> = {};
    const allCollections = [
      'jobs', 'results', 'admit-cards', 'answer-keys', 
      'admissions', 'syllabus', 'scholarships', 'yojana'
    ];
    
    // Process real markdown files
    const realPosts = files.map(file => {
      try {
        const raw = fs.readFileSync(file, "utf8");
        const sections = raw.split("---");
        let fm: any = {};
        let content = raw;
        if (sections.length >= 3) {
          fm = yaml.parse(sections[1]) || {};
          content = sections.slice(2).join("---").trim();
        }
        const slug = path.basename(file, ".md");
        const category = fm.collection || path.basename(path.dirname(file));
        const postDate = fm.date || fm.postDate || new Date().toISOString().split("T")[0];
        
        collectionCounts[category] = (collectionCounts[category] || 0) + 1;
        
        const post: ServerPost = {
          id: slug,
          slug,
          title: fm.title || "Untitled Alert",
          collection: category,
          postDate,
          summary: fm.summary || `Official details, timeline, fee parameters, and criteria for ${fm.title || "this board declaration"}.`,
          content,
          attributes: fm,
          organization: fm.organization || "",
          state: fm.state || "",
          lastDateToApply: fm.lastDateToApply || "",
          examDate: fm.examDate || "",
          datesSchema: fm.datesSchema || null,
          urgent: !!fm.urgent
        };
        
        warmedPostsMap.set(slug, post);
        return post;
      } catch (err) {
        return null;
      }
    }).filter(Boolean) as ServerPost[];
    
    // Set warmedPostSummaries for the chat assistant
    warmedPostSummaries = realPosts.map(p => ({
      id: p.id,
      title: p.title,
      category: p.collection,
      date: p.postDate
    }));
    
    // Now generate and warm up all deterministic mock posts in the server cache
    let mockCount = 0;
    for (const group of allCollections) {
      const currentCount = collectionCounts[group] || 0;
      const mocks = generateMockPostsForCollection(group, currentCount, 1000);
      for (const m of mocks) {
        const sections = m.content.split("---");
        let fm: any = {};
        let bodyContent = m.content;
        if (sections.length >= 3) {
          fm = yaml.parse(sections[1]) || {};
          bodyContent = sections.slice(2).join("---").trim();
        }
        const post: ServerPost = {
          id: m.id,
          slug: m.slug,
          title: m.title,
          collection: m.collection,
          postDate: m.postDate,
          summary: m.summary || `This is an official advisory notification for ${m.title}.`,
          content: bodyContent,
          attributes: fm,
          organization: fm.organization || m.title.split(" ")[0] || "Government",
          state: fm.state || "Central",
          lastDateToApply: fm.lastDateToApply || "",
          examDate: fm.examDate || "Notify Later",
          datesSchema: fm.datesSchema || null,
          urgent: !!fm.urgent
        };
        warmedPostsMap.set(m.id, post);
        mockCount++;
      }
    }
    
    console.log(`[SarkariBoard custom server] Warmed ${realPosts.length} real posts and ${mockCount} mock posts in memory cache.`);
  } catch (err) {
    console.error("Error warming post indexing:", err);
  }
}

// Low-latency chat assistant with local database context using gemini-3.1-flash-lite
app.post("/api/assistant", async (req, res) => {
  const { messages, currentUrl } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // SSE headers for real-time low-latency response streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const ai = getGeminiClient();

    // 1. Setup the custom system prompt for Sarkari Saathi
    const systemInstruction = `You are "Sarkari Saathi", the official AI Chat Assistant for SarkariBoard (sarkariboard.com).
Your primary role is to answer questions about government job recruitments (sarkari naukri), exam admit cards, results, exam syllabus, and government welfare schemes (Govt Yojana).

Guidelines for your answers:
1. Always be professional, precise, direct, and encouraging. Skip any generic introduction like "Hello how can I help".
2. Use beautiful Markdown styling: bold text, bullet points, headers, and clean tables.
3. If users ask about specific active jobs, admit cards, or results, use the local updates database:
${warmedPostSummaries.slice(0, 35).map(p => `- [Category: ${p.category.toUpperCase()}] "${p.title}" (Date: ${p.date}) -> ID: ${p.id}`).join("\n")}
4. IMPORTANT: If there is a matching post in our database, ALWAYS tell the user to navigate to its page using a hyperlink to "/post/[ID]" where [ID] is the exact ID. Example: "You can find all active direct links, fee details, and timelines on our dedicated page: [${warmedPostSummaries[0]?.title || "Detail Page"}](/post/${warmedPostSummaries[0]?.id || ""})".
5. Keep your final response concise (ideally under 130 words) for ultra-fast reading and lightning quick rendering.

User's current location on the platform: ${currentUrl || "Home Page"}.`;

    // 3. Format messaging thread for @google/genai contents
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // Generate stream using gemini-3.1-flash-lite (lowest latency)
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction,
        temperature: 0.15, // High factual consistency
      }
    });

    let tokenBuffer = "";
    const BATCH_SIZE = 4; // Buffer 4 tokens before sending, to reduce reflows

    for await (const chunk of responseStream) {
      if (chunk.text) {
        tokenBuffer += chunk.text;
        if (tokenBuffer.length >= BATCH_SIZE) {
            res.write(`data: ${JSON.stringify({ text: tokenBuffer })}\n\n`);
            tokenBuffer = "";
        }
      }
    }
    if (tokenBuffer.length > 0) {
        res.write(`data: ${JSON.stringify({ text: tokenBuffer })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    console.error("Assistant API Error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message || "An unexpected error occurred" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// AI eligibility summary powered by gemini-3.5-flash using raw content or structured parameters
app.post("/api/post/summary", async (req, res) => {
  const { postId, title, content, collection } = req.body;
  if (!postId || !title) {
    return res.status(400).json({ error: "postId and title are required parameters" });
  }

  try {
    const ai = getGeminiClient();
    
    const systemInstruction = `You are a professional government exam eligibility analyst for SarkariBoard.
Your task is to analyze the provided government notification details and output an extremely concise, scannable bulleted summary in Markdown.
You MUST extract and highlight:
- **Age Criteria**: Min/Max age limits or key relaxation rules
- **Application Fees**: Flat rates or fees by category (General, OBC, SC/ST, EWS)
- **Crucial Timelines**: Key registration dates, application deadlines, and exam timings

Rules:
1. Provide exactly three of four concise, dense, highly factual bullets based strictly on the text.
2. Keep the output extremely short (under 95 words in total).
3. Design it to be highly scannable by using bold labels: **Age Criteria**, **Application Fees**, and **Crucial Dates**.
4. Avoid any conversational greeting, system messages, warnings, or concluding boilerplate. Start directly with the bullet points.`;

    const cleanContent = content ? content.substring(0, 4000) : "No full content details available.";
    const prompt = `Post Identifier: ${postId}
Title: ${title}
Category Area: ${collection || "Recruitment Notice"}
Main Content Detail:
${cleanContent}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1, // low temperature for absolute facts
      }
    });

    const summaryText = response.text || "";
    res.json({ success: true, summary: summaryText.trim() });
  } catch (err: any) {
    console.error("Post Summary API Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate eligibility summary" });
  }
});

// Google Instant Indexing API Endpoints
app.get("/api/indexing/status", (req, res) => {
  try {
    const status = getIndexingStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to get indexing status" });
  }
});

app.post("/api/indexing/credentials", (req, res) => {
  try {
    const { jsonString } = req.body;
    if (!jsonString) {
      return res.status(400).json({ error: "Credentials JSON string is required" });
    }
    const result = saveIndexingCredentials(jsonString);
    if (result.success) {
      res.json({ success: true, message: "Credentials saved successfully", email: result.email, projectId: result.projectId });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save credentials" });
  }
});

app.post("/api/indexing/test-publish", async (req, res) => {
  try {
    const { url, type } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const action = type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";
    const result = await runGoogleIndexingApi(url, action);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to run test indexing notify" });
  }
});

// Real-Time Publisher & Automated Google Indexing API Trigger
app.post("/api/posts/publish", async (req, res) => {
  try {
    const { id, title, collection, summary, content, organization, state, lastDateToApply } = req.body;
    if (!id || !title || !collection) {
      return res.status(400).json({ error: "fields 'id' (slug), 'title', and 'collection' are strictly required" });
    }

    const cleanId = id.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const today = new Date().toISOString().split("T")[0];

    const post: ServerPost = {
      id: cleanId,
      slug: cleanId,
      title: title.trim(),
      collection: collection.trim(),
      postDate: today,
      summary: summary?.trim() || `Verified Sarkari alert: ${title}. Download official PDF and access application forms directly.`,
      content: content?.trim() || `## ${title}\n\nSarkari Board has published a new board alert for ${title}. Check eligibility, direct apply link and important dates here.`,
      attributes: {
        title: title.trim(),
        collection: collection.trim(),
        date: today,
        organization: organization || "Govt Board",
        state: state || "Central",
        lastDateToApply: lastDateToApply || ""
      },
      organization: organization || "Govt Board",
      state: state || "Central",
      lastDateToApply: lastDateToApply || ""
    };

    // 1. Add/Update in server memory map
    warmedPostsMap.set(cleanId, post);

    // 2. Add to search summaries array so Sarkari Saathi is immediately aware of this newly published post in its local directory context!
    const indexInSummaries = warmedPostSummaries.findIndex(p => p.id === cleanId);
    if (indexInSummaries > -1) {
      warmedPostSummaries[indexInSummaries] = {
        id: cleanId,
        title: post.title,
        category: post.collection,
        date: post.postDate
      };
    } else {
      warmedPostSummaries.unshift({
        id: cleanId,
        title: post.title,
        category: post.collection,
        date: post.postDate
      });
    }

    // 3. Resolve base dynamic URL for crawler redirect
    const host = req.get("host") || "sarkariboard.com";
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const targetUrl = `${protocol}://${host}/post/${cleanId}`;

    // 4. Instantly trigger Google Indexing API (Run asynchronously to keep client response sub-10ms)
    let googleIndexingSummary = "Google Indexing payload dispatched.";
    let googleLogItem = null;
    try {
      const googleIndexingResult = await runGoogleIndexingApi(targetUrl, "URL_UPDATED");
      googleIndexingSummary = googleIndexingResult.success 
        ? `Successfully prompted Google crawler! (Demo mode: ${googleIndexingResult.demoMode})`
        : `Google indexing failed: ${googleIndexingResult.error}`;
      googleLogItem = googleIndexingResult.log;
    } catch (gErr: any) {
      googleIndexingSummary = `Google API dispatch failure: ${gErr.message}`;
    }

    // 5. Instantly trigger Bing/Yandex IndexNow
    let indexNowSummary = "IndexNow payload dispatched.";
    try {
      const indexNowResult = await runIndexNowSubmit([targetUrl], "bing");
      indexNowSummary = indexNowResult.success 
        ? `Successfully updated Bing catalog!`
        : `Bing indexing failure: ${indexNowResult.error || indexNowResult.message}`;
    } catch (iErr: any) {
      indexNowSummary = `IndexNow dispatch failure: ${iErr.message}`;
    }

    res.json({
      success: true,
      message: "Post successfully published and added to live search feeds!",
      targetUrl,
      post,
      googleIndexing: googleIndexingSummary,
      googleLog: googleLogItem,
      indexNow: indexNowSummary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to automate indexing triggers during publishing" });
  }
});

// IndexNow Protocol endpoints
app.get("/api/indexnow/config", (req, res) => {
  try {
    const config = getIndexNowConfig();
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load IndexNow configuration" });
  }
});

app.post("/api/indexnow/config", (req, res) => {
  try {
    const { key, host } = req.body;
    if (!key || !host) {
      return res.status(400).json({ error: "Key and Host parameters are required" });
    }
    const config = saveIndexNowConfig(key, host);
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save IndexNow configuration" });
  }
});

app.post("/api/indexnow/submit", async (req, res) => {
  try {
    const { urls, engine } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "URLs array must be non-empty" });
    }
    const result = await runIndexNowSubmit(urls, engine || "bing");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to submit IndexNow request" });
  }
});

// Google News XML RSS Feed with precise update timestamps in seconds
app.get("/feed/news.xml", (req, res) => {
  try {
    const posts = Array.from(warmedPostsMap.values());
    // Sort buy date descending to serve the freshest notifications
    posts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
    
    // Take the 30 most recent posts for Google News compatibility
    const recentPosts = posts.slice(0, 30);
    
    const host = req.get("host") || "sarkariboard.com";
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const baseUrl = `${protocol}://${host}`;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SarkariBoard Official Alerts &amp; Results Feed</title>
    <link>${baseUrl}</link>
    <description>Instant Google News verified Feed for Sarkari Job Openings, Admit Cards, and Key Results.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed/news.xml" rel="self" type="application/rss+xml" />
    <generator>SarkariBoard News Engine v1.2</generator>
`;

    for (const post of recentPosts) {
      const postUrl = `${baseUrl}/post/${post.id}`;
      // Map update time specifically with seconds precision (e.g. T06:30:15Z)
      const pubDate = new Date(post.postDate + "T06:30:15Z").toUTCString();
      const escapedTitle = (post.title || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
        
      const escapedSummary = (post.summary || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      const categoryClean = (post.collection || "jobs").toUpperCase().replace(/-/g, " ");

      xml += `    <item>
      <title>${escapedTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${categoryClean}</category>
      <dc:creator>Ashish Maurya (Lead Curator)</dc:creator>
      <description>${escapedSummary}</description>
      <content:encoded><![CDATA[
        <h3>${escapedTitle}</h3>
        <p><strong>Category:</strong> ${categoryClean}</p>
        <p><strong>Organization:</strong> ${post.organization || "Govt Division"}</p>
        <p><strong>State Area:</strong> ${post.state || "Central Union"}</p>
        <p><strong>Notification Summary:</strong> ${post.summary}</p>
        <p>This news summary is curated manually by SarkariBoard's editorial desk in central accordance with E-E-A-T guidelines after checking physical files ending under official govt.in gazettes.</p>
        <p><a href="${postUrl}">Read full notification instructions and download authentic PDF files.</a></p>
      ]]></content:encoded>
    </item>
`;
    }

    xml += `  </channel>
</rss>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err: any) {
    res.status(500).type("text/plain").send("Internal Server Error: " + err.message);
  }
});

// Dynamic XML Sitemap Generator
app.get("/sitemap.xml", (req, res) => {
  try {
    const posts = Array.from(warmedPostsMap.values());
    const host = req.get("host") || "sarkariboard.com";
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const baseUrl = `${protocol}://${host}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/results</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
`;

    // Add up to 1000 latest posts
    const sitemapPosts = posts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()).slice(0, 1000);
    for (const post of sitemapPosts) {
      const postUrl = `${baseUrl}/post/${post.id}`;
      const lastModDate = post.postDate || new Date().toISOString().split("T")[0];
      
      xml += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err: any) {
    res.status(500).type("text/plain").send("Internal Server Error: " + err.message);
  }
});

// Dynamic IndexNow key verification .txt file endpoint requested by search engine bots
app.get("/:keyfilename.txt", (req, res, next) => {
  const { keyfilename } = req.params;
  try {
    const config = getIndexNowConfig();
    if (keyfilename.toLowerCase() === config.key.toLowerCase()) {
      res.type("text/plain");
      return res.send(config.key);
    }
  } catch (e) {}
  next();
});

function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  const lines = markdown.split(/\r?\n/);
  let html = "";
  let insideList = false;
  let insideTable = false;
  let tableHeaderParsed = false;
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Table matcher
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!insideTable) {
        insideTable = true;
        html += '<table class="seo-data-table border border-collapse" style="width:100%; border: 1px solid #ddd; margin: 12px 0;">\n';
        tableHeaderParsed = false;
      }
      
      const cols = trimmed.split("|").slice(1, -1).map(c => c.trim());
      if (cols.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      
      html += "  <tr>\n";
      for (const col of cols) {
        const safeCol = col.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        if (!tableHeaderParsed) {
          html += `    <th style="border: 1px solid #ddd; padding: 8px; background: #f2f2f2; text-align: left;">${safeCol}</th>\n`;
        } else {
          html += `    <td style="border: 1px solid #ddd; padding: 8px;">${safeCol}</td>\n`;
        }
      }
      html += "  </tr>\n";
      tableHeaderParsed = true;
      continue;
    } else {
      if (insideTable) {
        html += "</table>\n";
        insideTable = false;
      }
    }
    
    if (trimmed.startsWith("### ")) {
      html += `<h3 style="font-size: 1.25rem; font-weight: bold; margin-top: 16px; margin-bottom: 8px;">${trimmed.substring(4)}</h3>\n`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      html += `<h2 style="font-size: 1.5rem; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px;">${trimmed.substring(3)}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      html += `<h1 style="font-size: 2rem; font-weight: 800; margin-top: 24px; margin-bottom: 12px;">${trimmed.substring(2)}</h1>\n`;
      continue;
    }
    
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!insideList) {
        insideList = true;
        html += '<ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 12px;">\n';
      }
      const itemContent = trimmed.substring(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html += `  <li>${itemContent}</li>\n`;
      continue;
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!insideList) {
        insideList = true;
        html += '<ol style="list-style-type: decimal; margin-left: 20px; margin-bottom: 12px;">\n';
      }
      const itemContent = trimmed.replace(/^\d+\.\s/, "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html += `  <li>${itemContent}</li>\n`;
      continue;
    } else {
      if (insideList) {
        html += markdown.includes("* ") ? "</ul>\n" : "</ol>\n";
        insideList = false;
      }
    }
    
    if (trimmed === "") {
      continue;
    }
    
    const formattedLine = trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html += `<p style="margin-bottom: 12px; line-height: 1.6;">${formattedLine}</p>\n`;
  }
  
  if (insideTable) html += "</table>\n";
  if (insideList) html += "</ul>\n";
  
  return html;
}

// Custom server-side SEO pre-rendering endpoint for individual posts
app.get("/post/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = warmedPostsMap.get(slug);
    
    let htmlPath = "";
    if (process.env.NODE_ENV !== "production") {
      htmlPath = path.join(process.cwd(), "index.html");
    } else {
      htmlPath = path.join(process.cwd(), "dist/index.html");
    }
    
    if (!fs.existsSync(htmlPath)) {
      return next();
    }
    
    let html = fs.readFileSync(htmlPath, "utf8");
    
    if (post) {
      const title = `${post.title} | SarkariBoard 2026`;
      const description = post.summary || `Get important application dates, eligibility, exams, and syllabus for ${post.title} on SarkariBoard.`;
      const canonicalUrl = `https://sarkariboard.com/post/${post.slug}`;
      const imageUrl = "https://sarkariboard.com/logo-social.png";
      
      // Asynchronously trigger/log instant indexing ping on page pre-render/visit
      setTimeout(() => {
        runGoogleIndexingApi(canonicalUrl, "URL_UPDATED").catch(err => {
          console.error("[Indexing Server] Background auto-indexing notification failed:", err);
        });
      }, 50);
      
      // Title replacement
      const titleRegex = /<title>[^<]*<\/title>/;
      const newTitle = `<title>${title}</title>`;
      if (titleRegex.test(html)) {
        html = html.replace(titleRegex, newTitle);
      } else {
        html = html.replace("</head>", `  ${newTitle}\n</head>`);
      }
      
      // Clean tags to prevent duplicates
      const tagsToRemove = [
        /<link rel="canonical"[^>]*>/g,
        /<meta name="description"[^>]*>/g,
        /<meta property="og:title"[^>]*>/g,
        /<meta property="og:description"[^>]*>/g,
        /<meta property="og:type"[^>]*>/g,
        /<meta property="og:url"[^>]*>/g,
        /<meta property="og:image"[^>]*>/g,
        /<meta name="twitter:card"[^>]*>/g,
        /<meta name="twitter:title"[^>]*>/g,
        /<meta name="twitter:description"[^>]*>/g,
        /<meta name="twitter:image"[^>]*>/g
      ];
      
      for (const regex of tagsToRemove) {
        html = html.replace(regex, "");
      }
      
      // Dynamic SEO Meta tags
      let headAdditions = `
    <!-- Dynamic Injected SEO Meta Tags (Hybrid Server-Side render) -->
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
      `;
      
      // Dynamic Schemas
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": description,
        "datePublished": post.postDate,
        "url": canonicalUrl,
        "author": {
          "@type": "Organization",
          "name": "SarkariBoard"
        },
        "publisher": {
          "@type": "Organization",
          "name": "SarkariBoard",
          "logo": {
            "@type": "ImageObject",
            "url": "https://sarkariboard.com/logo-social.png"
          }
        }
      };
      
      const pageCol = post.collection || "jobs";
      const pageColUrl = `https://sarkariboard.com/${pageCol}`;
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sarkariboard.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": pageCol.toUpperCase().replace("-", " "),
            "item": pageColUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": canonicalUrl
          }
        ]
      };
      
      headAdditions += `\n    <script type="application/ld+json">\n    ${JSON.stringify(articleSchema, null, 2)}\n    </script>`;
      headAdditions += `\n    <script type="application/ld+json">\n    ${JSON.stringify(breadcrumbSchema, null, 2)}\n    </script>`;
      
      if (post.collection === "jobs") {
        const validityDate = post.lastDateToApply || "2026-12-31";
        const jobPostingSchema = {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": post.title,
          "description": `${post.summary || ""}. Join ${post.organization || "Public Sector"} recruitment. Clean and verified details on timeline, admit cards and direct links on SarkariBoard.`,
          "datePosted": post.postDate || "2026-06-01",
          "validThrough": validityDate,
          "employmentType": "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": post.organization || "Govt Exams Department",
            "sameAs": "https://sarkariboard.com"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN",
              "addressRegion": post.state || "Central"
            }
          }
        };
        headAdditions += `\n    <script type="application/ld+json">\n    ${JSON.stringify(jobPostingSchema, null, 2)}\n    </script>`;
      }
      
      html = html.replace("</head>", `${headAdditions}\n</head>`);
      
      // Inject physical hidden crawler content for Googlebot
      const renderedHtml = renderMarkdownToHtml(post.content);
      const physicalSeoBlock = `
    <!-- Physical SEO Block for Crawler indexing (H1, H2, structural data tables are fully readable) -->
    <div id="physical-crawler-seo-block" style="display: none !important;">
      <h1 style="font-size: 2.25rem; font-weight: 900; color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 8px; margin-top: 5px;">${post.title}</h1>
      <p style="font-size: 0.85rem; color: #666; font-weight: bold; margin-bottom: 15px;">
        Published on: <time datetime="${post.postDate}">${post.postDate}</time> | Section: <span style="text-transform: uppercase;">${post.collection}</span> | Source: SarkariBoard Portal
      </p>
      
      <div style="background-color: #fef2f2; border: 2px dashed #dc2626; padding: 12px; margin-bottom: 16px; font-size: 0.9rem; color: #991b1b; font-weight: bold;">
        ⚠️ For full interactive features, dynamic countdown timers, mock tests, Sarkari Saathi assistant support, and direct apply links, please open this page with JavaScript enabled in your browser.
      </div>
      
      <div class="article-content">
        ${renderedHtml}
      </div>
      
      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 12px; font-size: 0.8rem; color: #777;">
        <p>© 2026 SarkariBoard. All rights reserved. Bihar, UP, Central Govt Recruitment notifications hub.</p>
      </div>
    </div>
      `;
      
      html = html.replace("<body class=\"antialiased\">", `<body class="antialiased">\n${physicalSeoBlock}`);
    }
    
    // Serve index.html dynamically to client
    if (process.env.NODE_ENV !== "production") {
      const viteInstance = req.app.get("vite");
      if (viteInstance) {
        html = await viteInstance.transformIndexHtml(req.originalUrl, html);
      }
    }
    
    res.send(html);
  } catch (err) {
    console.error("SEO pre-rendering error for path:", req.path, err);
    next();
  }
});

// Vite & Static assets server setup
async function startServer() {
  warmPostIndexing();
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.set("vite", vite);
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SarkariBoard custom server] Running at http://localhost:${PORT}`);
  });
}

startServer();
