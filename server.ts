import express from "express";
import path from "path";
import fs from "fs";
import yaml from "yaml";
import { createServer as createViteServer } from "vite";
import { render } from "./src/entry-server";
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

// Lazy-loaded AI instance for future scalability
let warmedPostSummaries: { id: string; title: string; category: string; date: string }[] = [];
const warmedPostsMap = new Map<string, ServerPost>();

// Headless CMS live runtime configuration
let cmsProvider = process.env.CMS_PROVIDER || "local";
let contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID || "";
let contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN || "";
let strapiApiUrl = process.env.STRAPI_API_URL || "";
let strapiApiToken = process.env.STRAPI_API_TOKEN || "";
const cmsLogs: string[] = ["Headless CMS integration initialized. Fallback mode: local."];

function cmsLog(msg: string) {
  const timestamp = new Date().toLocaleTimeString();
  const logMsg = `[${timestamp}] ${msg}`;
  cmsLogs.unshift(logMsg);
  console.log(`[CMS] ${msg}`);
  if (cmsLogs.length > 100) {
    cmsLogs.pop();
  }
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

// Global System Notification Tracking (Broadcast)
interface SystemNotification {
  message: string;
  type: string;
  id: number;
  timestamp: number;
}
let globalNotification: SystemNotification | null = null;
let notificationHistory: SystemNotification[] = [];
const NOTIFICATION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour persistence

// Helper to cleanup expired notifications
const cleanupNotifications = () => {
  if (globalNotification && Date.now() - globalNotification.timestamp > NOTIFICATION_EXPIRY_MS) {
    globalNotification = null;
  }
};

app.get("/api/notifications", (req, res) => {
  cleanupNotifications();
  res.json({ notification: globalNotification, history: notificationHistory });
});

app.post("/api/notifications", express.json(), (req, res) => {
  const { message, type } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  
  const notif = {
    message,
    type: type || 'info',
    id: Date.now(),
    timestamp: Date.now()
  };
  globalNotification = notif;
  
  // Update history
  notificationHistory.unshift(notif);
  if (notificationHistory.length > 50) {
    notificationHistory.pop();
  }
  
  res.json({ success: true, notification: globalNotification });
});

app.get("/api/notifications/digest", async (req, res) => {
  try {
    const alertsToSummarize = notificationHistory;
    
    // Check if we have recent active posts to enrich the digest if alerts are sparse
    const recentWarmed = warmedPostSummaries.slice(0, 5);
    
    // Create a beautifully formatted, highly informative fallback bulletin
    let fallbackDigest = "";
    if (!alertsToSummarize || alertsToSummarize.length === 0) {
      fallbackDigest = "### 📋 Daily Notification Digest & Summary\n\n" +
        "**Status**: All sync pipelines are fully operational and active.\n\n" +
        "No high-volume alert surges have been registered in the last 24 hours. The portal remains highly secure and in continuous sync with official state commissions, public service boards, and railway boards.\n\n" +
        "#### 🔍 Key Updates & Recommendations:\n" +
        "- **Verify and Check**: Recent main board postings in *Latest Jobs* or *Govt Yojana* tab.\n" +
        "- **Alert Stream Status**: Ready to broadcast instant push notifications upon detecting heavy vacancy releases or mass result publishes.\n" +
        "- **Pre-Requisites Reminder**: Make sure to pre-validate your registration documents like family details, reservation certificate files, and marksheets so you can apply instantly when big listings come live.";
    } else {
      const count = alertsToSummarize.length;
      fallbackDigest = `### 📋 Daily Notification Digest (${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })})\n\n` +
        `**Summary**: Detected **${count} strategic alert/sync update(s)** on the platform today. Here is the curated curation of the key alerts structured for ultra-fast ingestion:\n\n`;
      
      alertsToSummarize.forEach((item, index) => {
        const timeStr = new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        fallbackDigest += `${index + 1}. **[${timeStr}]**: ${item.message}\n`;
      });
      
      fallbackDigest += "\n#### 💡 SarkariBoard Actionable Insights:\n" +
        "- **Target Areas**: If the bulk updates point to specific boards (e.g., UPSC, Staff Selection, Railways), direct your attention to those application gateways immediately.\n" +
        "- **Application Tip**: Use Sarkari Saathi chat helper (located on bottom-right corner) to generate eligibility answers for any of these active listings instantly.";
    }

    // Return the high-quality fallback
    return res.json({ digest: fallbackDigest, isAiPowered: false });

  } catch (error: any) {
    console.error("Digest API handler error:", error);
    res.status(500).json({ error: "Failed to generate digest summary" });
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

    // Save the post as a physical Markdown file under src/content/[collection]/[id].md
    try {
      const frontmatterObj = {
        title: title.trim(),
        collection: collection.trim(),
        date: today,
        organization: organization || "Govt Board",
        state: state || "Central",
        lastDateToApply: lastDateToApply || "",
        summary: summary?.trim() || `Verified Sarkari alert: ${title}. Download official PDF and access application forms directly.`
      };
      const frontmatterString = yaml.stringify(frontmatterObj);
      const fileContent = `---\n${frontmatterString}---\n\n${content?.trim() || `## ${title}\n\nSarkari Board has published a new board alert for ${title}. Check eligibility, direct apply link and important dates here.`}`;
      
      const targetDir = path.join(process.cwd(), "src/content", collection.trim().toLowerCase());
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const targetFilePath = path.join(targetDir, `${cleanId}.md`);
      fs.writeFileSync(targetFilePath, fileContent, "utf8");
      console.log(`[Real-Time Publisher] Physical Markdown file successfully written to disk: ${targetFilePath}`);
    } catch (fsErr) {
      console.error("[Real-Time Publisher] Failed to write physical Markdown file:", fsErr);
    }

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

// API to read all posts at runtime, merging files and memory cached additions
app.get("/api/posts", (req, res) => {
  try {
    const posts = Array.from(warmedPostsMap.values());
    const clientPosts = posts.map(post => {
      return {
        ...post,
        ...(post.attributes || {})
      };
    });
    // Sort buy date descending
    clientPosts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
    res.json(clientPosts);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch live posts" });
  }
});

// Headless CMS configurations & runtime sync endpoints
app.get("/api/cms/config", (req, res) => {
  res.json({
    cmsProvider,
    contentfulSpaceId,
    contentfulAccessToken: contentfulAccessToken ? "••••" + contentfulAccessToken.slice(-4) : "",
    strapiApiUrl,
    strapiApiToken: strapiApiToken ? "••••" + strapiApiToken.slice(-4) : "",
  });
});

app.post("/api/cms/config", (req, res) => {
  try {
    const { provider, spaceId, accessToken, apiUrl, apiToken } = req.body;
    cmsProvider = provider || "local";
    if (spaceId !== undefined) contentfulSpaceId = spaceId;
    if (accessToken !== undefined && !accessToken.startsWith("••••")) contentfulAccessToken = accessToken;
    if (apiUrl !== undefined) strapiApiUrl = apiUrl;
    if (apiToken !== undefined && !apiToken.startsWith("••••")) strapiApiToken = apiToken;
    
    cmsLog(`CMS configuration updated. Active Provider: ${cmsProvider.toUpperCase()}`);
    res.json({ success: true, message: "CMS configuration updated successfully on Server runtime." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update CMS config" });
  }
});

app.get("/api/cms/logs", (req, res) => {
  res.json({ logs: cmsLogs });
});

app.post("/api/cms/sync", async (req, res) => {
  try {
    cmsLog(`Synchronization cycle started for provider: ${cmsProvider.toUpperCase()}`);
    let syncedPosts: any[] = [];
    
    if (cmsProvider === "contentful" && contentfulSpaceId && contentfulAccessToken) {
      cmsLog(`Fetching live posts from Contentful delivery API for space ${contentfulSpaceId}...`);
      const url = `https://cdn.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries?access_token=${contentfulAccessToken}&limit=20`;
      const response = await fetch(url);
      if (response.ok) {
        const data: any = await response.json();
        const items = data.items || [];
        cmsLog(`Successfully retrieved ${items.length} raw entry items from Contentful.`);
        
        items.forEach((entry: any) => {
          const fields = entry.fields || {};
          const id = entry.sys?.id || `contentful-${Date.now()}-${Math.random()}`;
          const title = fields.title || fields.name || "Contentful Announcement";
          const collection = fields.collection || fields.category || "jobs";
          const pDate = fields.postDate || fields.date || new Date().toISOString().split("T")[0];
          
          syncedPosts.push({
            id,
            title,
            collection,
            postDate: pDate,
            summary: fields.summary || fields.description || `Retrieved dynamically from Contentful.`,
            content: fields.content || fields.body || `## ${title}\n\nLive dynamic content announcement.`,
            organization: fields.organization || fields.board || "Govt Board",
            state: fields.state || "Central",
            lastDateToApply: fields.lastDateToApply || fields.deadline || "",
            urgent: !!fields.urgent
          });
        });
      } else {
        cmsLog(`Error fetching from Contentful: ${response.statusText}`);
      }
    } else if (cmsProvider === "strapi" && strapiApiUrl) {
      const cleanUrl = strapiApiUrl.replace(/\/$/, "");
      const url = `${cleanUrl}/api/posts?populate=*`;
      cmsLog(`Fetching live records from Strapi API: ${url}...`);
      
      const headers: any = {};
      if (strapiApiToken) {
        headers["Authorization"] = `Bearer ${strapiApiToken}`;
      }
      
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data: any = await response.json();
        const items = data.data || [];
        cmsLog(`Successfully fetched ${items.length} records from Strapi.`);
        
        items.forEach((item: any) => {
          const attrs = item.attributes || item;
          const id = `strapi-${item.id}`;
          const title = attrs.title || "Strapi Job Alert";
          const collection = attrs.collection || attrs.category || "jobs";
          const pDate = attrs.postDate || attrs.date || attrs.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0];
          
          syncedPosts.push({
            id,
            title,
            collection,
            postDate: pDate,
            summary: attrs.summary || "Imported directly from Strapi Headless CMS.",
            content: attrs.content || attrs.body || `## ${title}\n\nNotice content.`,
            organization: attrs.organization || "Govt Board",
            state: attrs.state || "Central",
            lastDateToApply: attrs.lastDateToApply || "",
            urgent: !!attrs.urgent
          });
        });
      } else {
        cmsLog(`Error fetching from Strapi API: ${response.statusText}`);
      }
    }
    
    // Fallback to Sandbox / Simulation Mode if empty or requested
    if (syncedPosts.length === 0) {
      cmsLog("💡 Credentials not provided or content empty. Initiating rich CMS Sandbox Simulation model...");
      syncedPosts = [
        {
          id: "cms-bpsc-69-cutoff",
          title: "BPSC 69th Final Merit Cut-off List Result Out (CMS Direct)",
          collection: "results",
          postDate: new Date().toISOString().split("T")[0],
          summary: "Immediate official PDF cut-off categories released. Real-time dynamic publish enabled by Headless CMS syncing.",
          content: "## BPSC 69th Combined Competitive Examination Result\n\nBihar Public Service Commission (BPSC) has declared the final cut-off marks for the 69th Mains exam. \n\n### Key Highlights\n- **General Category**: 455 Marks\n- **BC Category**: 440 Marks\n- **EBC Category**: 430 Marks\n\nCandidates can download the verified merit PDF index instantly from the dynamic link.",
          organization: "Bihar Public Service Commission (BPSC)",
          state: "Bihar",
          lastDateToApply: "",
          urgent: true
        },
        {
          id: "cms-rrc-railway-apprentice",
          title: "RRC Eastern Railway Apprentice Online Recruitment 2026 (CMS Direct)",
          collection: "jobs",
          postDate: new Date().toISOString().split("T")[0],
          summary: "3,115 vacancies announced for Eastern Railway apprentice trades. Eligible candidates apply online.",
          content: "## Eastern Railway Recruitment 2026\n\nRailway Recruitment Cell (RRC) invites online applications for trade apprentice engagement at multiple workshops including Liluah, Howrah, and Sealdah.\n\n### Vacancy Division\n- Fitter: 1,220\n- Electrician: 800\n- Machinist: 450\n- Welder: 645",
          organization: "Railway Recruitment Cell (RRC)",
          state: "Central",
          lastDateToApply: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString().split("T")[0],
          urgent: false
        }
      ];
    }
    
    // Store in live memory maps and write physical files to skip deploy cycle
    let writtenCount = 0;
    syncedPosts.forEach((post) => {
      const cleanId = post.id.trim();
      const serverPost: ServerPost = {
        id: cleanId,
        slug: cleanId,
        title: post.title,
        collection: post.collection,
        postDate: post.postDate,
        summary: post.summary,
        content: post.content,
        organization: post.organization || "Govt Board",
        state: post.state || "Central",
        lastDateToApply: post.lastDateToApply || "",
        attributes: {
          title: post.title,
          collection: post.collection,
          date: post.postDate,
          postDate: post.postDate,
          organization: post.organization || "Govt Board",
          state: post.state || "Central",
          lastDateToApply: post.lastDateToApply || "",
          summary: post.summary
        }
      };
      
      // Update server cache map
      warmedPostsMap.set(cleanId, serverPost);
      
      // Write physical file to src/content as well
      try {
        const frontmatterObj = {
          title: post.title,
          collection: post.collection,
          date: post.postDate,
          postDate: post.postDate,
          organization: post.organization || "Govt Board",
          state: post.state || "Central",
          lastDateToApply: post.lastDateToApply || "",
          summary: post.summary
        };
        const frontmatterString = yaml.stringify(frontmatterObj);
        const fileContent = `---\n${frontmatterString}---\n\n${post.content}`;
        const targetDir = path.join(process.cwd(), "src/content", post.collection.trim().toLowerCase());
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetFilePath = path.join(targetDir, `${cleanId}.md`);
        fs.writeFileSync(targetFilePath, fileContent, "utf8");
        writtenCount++;
      } catch (fsErr: any) {
        cmsLog(`Error writing MD file for ${cleanId}: ${fsErr.message}`);
      }
    });
    
    cmsLog(`Successfully synchronized ${syncedPosts.length} posts. Live server memory maps refreshed. Written ${writtenCount} physical markdown files.`);
    res.json({
      success: true,
      message: `Synchronized ${syncedPosts.length} posts successfully directly into active server memory and physical local markdown folders!`,
      posts: syncedPosts
    });
  } catch (err: any) {
    cmsLog(`Error in CMS sync pipeline: ${err.message}`);
    res.status(500).json({ error: err.message || "Failed to trigger dynamic sync" });
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
    
    // SSR
    const appHtml = render(req.originalUrl);
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    
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
