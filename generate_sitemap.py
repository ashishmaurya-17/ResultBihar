#!/usr/bin/env python3
"""
SarkariBoard - High-Throughput Automated Sitemap Generator v1.0 (Python)
Dynamically scans all static routes and markdown database posts at runtime
to update search engine indexing instantly.
"""

import os
import re
import sys
import datetime
import urllib.parse

def load_env_variables():
    """
    Loads key variables from .env file manually to avoid dependency on third-party dotenv.
    """
    env_vars = {
        "APP_URL": "https://sarkariboard.com",
        "GSC_SITE_URL": "",
        "GSC_CLIENT_EMAIL": "",
        "GSC_PRIVATE_KEY": ""
    }
    
    env_path = os.path.join(os.getcwd(), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip()
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    env_vars[key] = val
        except Exception as e:
            print(f"⚠️ Warning loading .env file: {e}")
            
    # Override with system env if defined
    for k in env_vars:
        sys_val = os.getenv(k)
        if sys_val:
            env_vars[k] = sys_val
            
    return env_vars

def get_frontmatter_value(content, key):
    """
    Carefully parses frontmatter YAML key values via custom regex.
    """
    pattern = rf"^{key}:\s*['\"]?([^'\"\n]+)['\"]?"
    match = re.search(pattern, content, re.MULTILINE | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def standardize_date(raw_date):
    """
    Standardizes dates in various formats to ISO YYYY-MM-DD.
    """
    if not raw_date:
        return None
    raw_date = raw_date.strip()
    
    # Format: DD/MM/YYYY or MM/DD/YYYY to YYYY-MM-DD
    if '/' in raw_date:
        parts = raw_date.split('/')
        if len(parts) == 3:
            # Check if last part is the 4-digit year
            if len(parts[2]) == 4:
                return f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
            # Check if first part was the 4-digit year
            elif len(parts[0]) == 4:
                return f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                
    # Format: YYYY-MM-DD
    if re.match(r"^\d{4}-\d{2}-\d{2}$", raw_date):
        return raw_date
        
    return None

def escape_xml(text):
    """
    Escapes special characters to ensure valid, crawlable XML format.
    """
    if not text:
        return ""
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;")
                .replace("'", "&apos;"))

def get_all_markdown_files(content_path):
    """
    Recursively finds all markdown files under a given folder path.
    """
    md_files = []
    if not os.path.exists(content_path):
        return md_files
        
    for root, _, files in os.walk(content_path):
        for file in files:
            if file.lower().endswith(".md"):
                md_files.append(os.path.join(root, file))
    return md_files

def main():
    print("🚀 --- SarkariBoard Python Dynamic Sitemap Pipeline ---")
    
    # 1. Setup Configuration
    env = load_env_variables()
    base_url = env["APP_URL"]
    current_date_str = datetime.date.today().isoformat()
    
    print(f"🔗 Target Core Host URL: {base_url}")
    print(f"📅 Timestamp Generation Date: {current_date_str}")
    
    # 2. Static Pages Definition
    static_pages = [
        {"path": "", "priority": "1.0", "changefreq": "daily"},
        {"path": "tools", "priority": "0.95", "changefreq": "weekly"},
        {"path": "faqs", "priority": "0.80", "changefreq": "weekly"},
        {"path": "contact", "priority": "0.70", "changefreq": "weekly"},
        {"path": "about", "priority": "0.60", "changefreq": "monthly"},
        {"path": "disclaimer", "priority": "0.40", "changefreq": "monthly"},
        {"path": "privacy", "priority": "0.40", "changefreq": "monthly"},
        {"path": "terms", "priority": "0.40", "changefreq": "monthly"}
    ]
    
    sitemap_entries = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    # Append static pages to standard sitemap XML
    for p in static_pages:
        page_url = f"{base_url}/{p['path']}" if p["path"] else f"{base_url}/"
        sitemap_entries.append("  <url>")
        sitemap_entries.append(f"    <loc>{escape_xml(page_url)}</loc>")
        sitemap_entries.append(f"    <lastmod>{current_date_str}</lastmod>")
        sitemap_entries.append(f"    <changefreq>{p['changefreq']}</changefreq>")
        sitemap_entries.append(f"    <priority>{p['priority']}</priority>")
        sitemap_entries.append("  </url>")
        
    print(f"📁 Adding {len(static_pages)} static core application routes...")
    
    # 3. Dynamic Markdown Posts Scan
    content_dir = os.path.join(os.getcwd(), "src", "content")
    md_files = get_all_markdown_files(content_dir)
    print(f"🔍 Scanned and discovered {len(md_files)} database post documents...")
    
    # Initialize news sitemap entries
    news_sitemap_entries = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
    ]
    
    posts_included = 0
    news_included = 0
    
    for file_path in md_files:
        try:
            with open(file_path, "r", encoding="utf8") as f:
                content = f.read()
                
            slug = os.path.splitext(os.path.basename(file_path))[0]
            post_url = f"{base_url}/post/{slug}"
            
            # extract frontmatter attributes safely
            post_date_raw = get_frontmatter_value(content, "postDate") or get_frontmatter_value(content, "date") or ""
            last_date_raw = get_frontmatter_value(content, "lastDateToApply") or get_frontmatter_value(content, "applicationEnd") or ""
            collection = get_frontmatter_value(content, "collection") or "jobs"
            title = get_frontmatter_value(content, "title") or slug
            
            post_date = standardize_date(post_date_raw) or current_date_str
            last_date = standardize_date(last_date_raw)
            
            # --- Smart Crawl Budget Policy ---
            is_expired = last_date and last_date < current_date_str
            
            if is_expired:
                changefreq = "monthly"
                priority = "0.50"
            else:
                if collection.lower() == "jobs":
                    changefreq = "daily"
                    priority = "0.90"
                elif collection.lower() in ("results", "admit-cards", "admit_cards"):
                    # Calculate difference in days to boost fresh outcomes
                    try:
                        d1 = datetime.datetime.strptime(current_date_str, "%Y-%m-%d")
                        d2 = datetime.datetime.strptime(post_date, "%Y-%m-%d")
                        diff_days = abs((d1 - d2).days)
                    except Exception:
                        diff_days = 999
                        
                    if diff_days <= 30:
                        changefreq = "daily"
                        priority = "0.85"
                    else:
                        changefreq = "weekly"
                        priority = "0.70"
                else:
                    changefreq = "weekly"
                    priority = "0.75"
            
            # Add to general sitemap
            sitemap_entries.append("  <url>")
            sitemap_entries.append(f"    <loc>{escape_xml(post_url)}</loc>")
            sitemap_entries.append(f"    <lastmod>{post_date}</lastmod>")
            sitemap_entries.append(f"    <changefreq>{changefreq}</changefreq>")
            sitemap_entries.append(f"    <priority>{priority}</priority>")
            sitemap_entries.append("  </url>")
            posts_included += 1
            
            # Add to News Sitemap if published in the last 7 days and is a top alert category
            if collection.lower() in ("jobs", "results", "admit-cards", "admit_cards"):
                try:
                    d1 = datetime.datetime.strptime(current_date_str, "%Y-%m-%d")
                    d2 = datetime.datetime.strptime(post_date, "%Y-%m-%d")
                    diff_days = abs((d1 - d2).days)
                except Exception:
                    diff_days = 999
                    
                if diff_days <= 7:
                    news_sitemap_entries.append("  <url>")
                    news_sitemap_entries.append(f"    <loc>{escape_xml(post_url)}</loc>")
                    news_sitemap_entries.append("    <news:news>")
                    news_sitemap_entries.append("      <news:publication>")
                    news_sitemap_entries.append("        <news:name>SarkariBoard</news:name>")
                    news_sitemap_entries.append("        <news:language>en</news:language>")
                    news_sitemap_entries.append("      </news:publication>")
                    news_sitemap_entries.append(f"      <news:publication_date>{post_date}T00:00:00+00:00</news:publication_date>")
                    news_sitemap_entries.append(f"      <news:title>{escape_xml(title)}</news:title>")
                    news_sitemap_entries.append("    </news:news>")
                    news_sitemap_entries.append("  </url>")
                    news_included += 1
                    
        except Exception as err:
            print(f"⚠️ Skipping file {file_path} due to error: {err}")
            
    sitemap_entries.append("</urlset>")
    news_sitemap_entries.append("</urlset>")
    
    sitemap_content = "\n".join(sitemap_entries)
    news_sitemap_content = "\n".join(news_sitemap_entries)
    
    # 4. Save Outputs
    public_dir = os.path.join(os.getcwd(), "public")
    if not os.path.exists(public_dir):
        os.makedirs(public_dir, exist_ok=True)
        
    sitemap_pub_path = os.path.join(public_dir, "sitemap.xml")
    news_pub_path = os.path.join(public_dir, "news-sitemap.xml")
    
    with open(sitemap_pub_path, "w", encoding="utf8") as f:
        f.write(sitemap_content)
    with open(news_pub_path, "w", encoding="utf8") as f:
        f.write(news_sitemap_content)
        
    print(f"💾 Public Standard Sitemap built at: {sitemap_pub_path} ({posts_included + len(static_pages)} items)")
    print(f"💾 Public Google News Sitemap built at: {news_pub_path} ({news_included} items within last 7 days)")
    
    # Save to dist/ folder too if built assets exist
    dist_dir = os.path.join(os.getcwd(), "dist")
    if os.path.exists(dist_dir):
        sitemap_dist_path = os.path.join(dist_dir, "sitemap.xml")
        news_dist_path = os.path.join(dist_dir, "news-sitemap.xml")
        
        with open(sitemap_dist_path, "w", encoding="utf8") as f:
            f.write(sitemap_content)
        with open(news_dist_path, "w", encoding="utf8") as f:
            f.write(news_sitemap_content)
        print(f"✨ Copied both updated sitemaps directly to runtime output: {dist_dir}")
        
    print("✅ --- Sitemap Generator Finished Successfully (Python) ---")

if __name__ == "__main__":
    main()
