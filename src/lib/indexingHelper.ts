import fs from "fs";
import path from "path";
import { JWT } from "google-auth-library";

export interface IndexingLog {
  id: string;
  url: string;
  action: "URL_UPDATED" | "URL_DELETED";
  timestamp: string;
  status: "success" | "failed" | "demo_success";
  response?: string;
  errorMessage?: string;
}

export interface IndexNowLog {
  timestamp: string;
  urls: string[];
  engine: string;
  status: number | string;
  success: boolean;
  errorMessage?: string;
}

export interface IndexNowConfig {
  key: string;
  host: string;
  keyLocation: string;
  logs: IndexNowLog[];
}

const CREDENTIALS_PATH = path.join(process.cwd(), "google-credentials.json");
const LOGS_PATH = path.join(process.cwd(), "indexing-logs.json");
const INDEXNOW_CONFIG_PATH = path.join(process.cwd(), "indexnow-config.json");

// Retrieve full service credentials status
export function getIndexingStatus() {
  const exists = fs.existsSync(CREDENTIALS_PATH);
  let email: string | null = null;
  let projectId: string | null = null;

  if (exists) {
    try {
      const raw = fs.readFileSync(CREDENTIALS_PATH, "utf8");
      const creds = JSON.parse(raw);
      email = creds.client_email || null;
      projectId = creds.project_id || null;
    } catch (err) {
      // invalid json
    }
  }

  const logs = getIndexingLogs();

  return {
    configured: !!email,
    serviceAccountEmail: email,
    projectId,
    totalLogs: logs.length,
    recentLogs: logs.slice(0, 50),
  };
}

// Persist Google Service Account Credentials
export function saveIndexingCredentials(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("Missing client_email or private_key in Service Account JSON credentials.");
    }
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(parsed, null, 2), "utf8");
    return { success: true, email: parsed.client_email, projectId: parsed.project_id };
  } catch (err: any) {
    return { success: false, error: err.message || "Invalid JSON content format" };
  }
}

// Get historically saved Indexing Logs
export function getIndexingLogs(): IndexingLog[] {
  if (!fs.existsSync(LOGS_PATH)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(LOGS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Write a new index log entry
export function appendIndexingLog(log: Omit<IndexingLog, "id" | "timestamp">) {
  const logs = getIndexingLogs();
  const newLog: IndexingLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  
  logs.unshift(newLog); // Put most recent at the top
  try {
    fs.writeFileSync(LOGS_PATH, JSON.stringify(logs.slice(0, 100), null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write indexing logs:", err);
  }
  return newLog;
}

// Call the Real Google Indexing API
export async function runGoogleIndexingApi(url: string, action: "URL_UPDATED" | "URL_DELETED") {
  const exists = fs.existsSync(CREDENTIALS_PATH);
  
  if (!exists) {
    // Return mock success for simulation or demo mode
    const demoLog = appendIndexingLog({
      url,
      action,
      status: "demo_success",
      response: JSON.stringify({
        mode: "DEMO_SIMULATION",
        info: "Service account file google-credentials.json was not found. System stimulated this notification successfully.",
        urlNotificationMetadata: {
          url,
          latestUpdate: {
            url,
            type: action,
            notifyTime: new Date().toISOString()
          }
        }
      }, null, 2)
    });
    return {
      success: true,
      demoMode: true,
      log: demoLog
    };
  }

  try {
    const raw = fs.readFileSync(CREDENTIALS_PATH, "utf8");
    const credentials = JSON.parse(raw);
    
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    // Make request using Google Auth JSON Web Token client
    const res = await client.request({
      url: "https://indexing.googleapis.com/v1/urlNotifications:publish",
      method: "POST",
      data: {
        url,
        type: action,
      },
    });

    const responseData = JSON.stringify(res.data, null, 2);
    const successLog = appendIndexingLog({
      url,
      action,
      status: "success",
      response: responseData
    });

    return {
      success: true,
      demoMode: false,
      data: res.data,
      log: successLog
    };
  } catch (err: any) {
    const errorMessage = err.response?.data?.error?.message || err.message || "Unknown auth error checking Google Indexing credentials";
    
    const failedLog = appendIndexingLog({
      url,
      action,
      status: "failed",
      errorMessage
    });

    return {
      success: false,
      demoMode: false,
      error: errorMessage,
      log: failedLog
    };
  }
}

// --- INDEXNOW PROTOCOL IMPLEMENTATION ---

export function getIndexNowConfig(): IndexNowConfig {
  const defaultKey = "7eb0b5ee2e604ba0ad8f615822eeebf4";
  const defaultHost = "sarkariboard.com";
  
  const defaultConfig: IndexNowConfig = {
    key: defaultKey,
    host: defaultHost,
    keyLocation: `https://${defaultHost}/${defaultKey}.txt`,
    logs: []
  };

  if (!fs.existsSync(INDEXNOW_CONFIG_PATH)) {
    try {
      fs.writeFileSync(INDEXNOW_CONFIG_PATH, JSON.stringify(defaultConfig, null, 2), "utf8");
      return defaultConfig;
    } catch (err) {
      return defaultConfig;
    }
  }

  try {
    const raw = fs.readFileSync(INDEXNOW_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as IndexNowConfig;
    return {
      key: parsed.key || defaultKey,
      host: parsed.host || defaultHost,
      keyLocation: parsed.keyLocation || `https://${parsed.host || defaultHost}/${parsed.key || defaultKey}.txt`,
      logs: Array.isArray(parsed.logs) ? parsed.logs : []
    };
  } catch (err) {
    return defaultConfig;
  }
}

export function saveIndexNowConfig(key: string, host: string): IndexNowConfig {
  const current = getIndexNowConfig();
  const updated: IndexNowConfig = {
    ...current,
    key: key.trim().toLowerCase(),
    host: host.trim().toLowerCase(),
    keyLocation: `https://${host.trim().toLowerCase()}/${key.trim().toLowerCase()}.txt`
  };

  try {
    fs.writeFileSync(INDEXNOW_CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write IndexNow configuration", err);
  }
  return updated;
}

export async function runIndexNowSubmit(urls: string[], engine: string = "bing") {
  const config = getIndexNowConfig();
  const apiEndpoint = engine === "yandex" 
    ? "https://yandex.com/indexnow" 
    : "https://www.bing.com/indexnow";
  
  const payload = {
    host: config.host,
    key: config.key,
    keyLocation: config.keyLocation,
    urlList: urls
  };

  const isLocallySandboxed = config.host.includes("run.app") || config.host.includes("localhost");

  if (isLocallySandboxed) {
    // Return mock success with explanation since search engine bots cannot pull keys from developer container domains
    const mockLog: IndexNowLog = {
      timestamp: new Date().toISOString(),
      urls,
      engine: engine.toUpperCase(),
      status: 200,
      success: true,
      errorMessage: "Local Dev/Cloud Sandbox simulated ping. Bing/Yandex engine requires a public production domain to pull verification key."
    };
    
    const updated = {
      ...config,
      logs: [mockLog, ...config.logs].slice(0, 50)
    };
    try {
      fs.writeFileSync(INDEXNOW_CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
    } catch {}
    return { success: true, status: 200, demoMode: true, message: mockLog.errorMessage };
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const isSuccess = response.status === 200 || response.status === 202;
    const log: IndexNowLog = {
      timestamp: new Date().toISOString(),
      urls,
      engine: engine.toUpperCase(),
      status: response.status,
      success: isSuccess,
      errorMessage: isSuccess ? undefined : `Engine returned error HTTP ${response.status}`
    };

    const updated = {
      ...config,
      logs: [log, ...config.logs].slice(0, 50)
    };
    try {
      fs.writeFileSync(INDEXNOW_CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
    } catch {}

    return {
      success: isSuccess,
      status: response.status,
      demoMode: false,
      message: isSuccess ? "Success: URLs Submitted successfully!" : `Failed: Server status ${response.status}`
    };

  } catch (err: any) {
    const log: IndexNowLog = {
      timestamp: new Date().toISOString(),
      urls,
      engine: engine.toUpperCase(),
      status: 500,
      success: false,
      errorMessage: err.message || "Failed to establish outbound HTTP fetch to IndexNow"
    };

    const updated = {
      ...config,
      logs: [log, ...config.logs].slice(0, 50)
    };
    try {
      fs.writeFileSync(INDEXNOW_CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
    } catch {}

    return {
      success: false,
      status: 500,
      demoMode: false,
      error: log.errorMessage
    };
  }
}

