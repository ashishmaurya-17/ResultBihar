# 🛠️ SarkariBoard Automation Engine Documentation

This documentation explains how to set up, configure, and execute the Python-based scraping pipeline that feeds real-time government job data into the SarkariBoard React application.

## 1. System Architecture
The automation works as a **Producer-Consumer** model:
1. **Producer (Python)**: `automation.py` scrapes official sites, structures the data into JSON, and pushes it to an API endpoint.
2. **Consumer (React/Express)**: The Express server receives the data, updates the local storage/memory, and notifies the React frontend.

---

## 2. Environment Setup

### Prerequisites
- Python 3.9 or higher
- Node.js (for the running application server)

### Installation
Run the following commands in your terminal:

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install core dependencies
pip install requests beautifulsoup4 playwright

# 4. Install Playwright browsers (Required for JS-heavy sites)
playwright install chromium
```

---

## 3. Configuration & Integration

### API Endpoint mapping
The `automation.py` script targets the following internal endpoint:
`POST http://localhost:3000/api/posts/publish`

**Data Schema Requirement:**
The scraper must generate JSON objects that match the following TypeScript interface:
```typescript
{
  id: string;          // Unique ID (e.g., 'upsc-2026-cgl')
  title: string;       // Public title
  collection: string;  // Must be: 'jobs', 'results', 'admit-cards', etc.
  org: string;         // Organization acronym (e.g., 'UPSC')
  summary: string;     // Short SEO summary
  content: string;     // Markdown description
  lastDate?: string;   // ISO format date
}
```

---

## 4. Execution

### Standard Scrape (Static Sites)
To run the standard scraper:
```bash
python automation.py
```

### Advanced Scrape (Dynamic/JS Sites)
If the government portal requires JavaScript to load (like many SSC/Railway sites), `automation.py` can be extended with Playwright:

```python
from playwright.sync_api import sync_playwright

def scrape_dynamic_page(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        # Wait for the table to load
        page.wait_for_selector(".notification-table")
        content = page.content()
        browser.close()
        return content
```

### 🛰️ Dynamic Sitemap Generator (Python)
We have added a custom automated Python sitemap generator `generate_sitemap.py` at the root. It reads static page definitions and dynamically scans all markdown database posts from `src/content/`.

To manually trigger sitemap and news sitemap generation:
```bash
python generate_sitemap.py
```

**Features Included:**
1. **Zero External Dependencies**: Uses built-in Python libraries (`os`, `re`, `datetime`, `urllib.parse`) so it can be scheduled on any container, lightweight VM, or shell script out-of-the-box.
2. **Smart Priorities & Crawl Budgets**: Downgrades expired listings to lowest crawl frequency (`monthly`, priority `0.50`) and boosts active alerts/results up to `daily` priority (`0.90` and `0.85` respectively).
3. **Google News XML Schema**: Generates a secondary `news-sitemap.xml` file which includes top alert categories published in the last 7 days conforming exactly to Google's news indexing specification.
4. **Dual Directories sync**: Automatically writes to `public/` and copies directly to `dist/` if a build has already been generated.


---

## 5. React State Consumption
Once `automation.py` triggers the `publish` API:
1. The **Express Server (`server.ts`)** adds the new post to the array.
2. It triggers **Google Search Console Indexing** (if credentials are set).
3. The **React Frontend** fetches the updated list via `useEffect` in `MainPortal.tsx`.
4. The **Store (`store.ts`)** updates, and the UI re-renders with the new "Live" badge alerts automatically.

---

## 6. Maintenance & Logs
- **Error Handling**: The script logs failures to `automation.log`.
- **Duplicate Prevention**: The server checks the `id` field. Ensure your scraper generates deterministic IDs based on the job URL or reference number.
