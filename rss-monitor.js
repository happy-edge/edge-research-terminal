const Parser = require('rss-parser');
const fs = require('fs').promises;
const path = require('path');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'EdgeTerminal/1.0'
  }
});

const FEEDS = [
  // Yahoo Finance - Mag 7 specific
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=NVDA', name: 'Yahoo NVDA' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL', name: 'Yahoo AAPL' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=MSFT', name: 'Yahoo MSFT' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=GOOGL', name: 'Yahoo GOOGL' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AMZN', name: 'Yahoo AMZN' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=META', name: 'Yahoo META' },
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=TSLA', name: 'Yahoo TSLA' },
  // General tech/market news
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', name: 'CNBC Tech' },
  { url: 'https://www.investing.com/rss/news_301.rss', name: 'Investing.com Tech' },
];

const MAG7_TICKERS = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA'];
const MAG7_NAMES = ['nvidia', 'apple', 'microsoft', 'google', 'alphabet', 'amazon', 'meta', 'facebook', 'tesla'];

const RESEARCH_DIR = path.join(__dirname, '..', 'research');
const STATE_FILE = path.join(__dirname, 'rss-state.json');

// Load seen articles
async function loadState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { seen: {}, lastRun: null };
  }
}

async function saveState(state) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

// Check if article mentions Mag 7
function getMentionedTickers(text) {
  const lower = text.toLowerCase();
  const found = [];
  
  MAG7_TICKERS.forEach(ticker => {
    if (text.includes(ticker)) found.push(ticker);
  });
  
  MAG7_NAMES.forEach((name, i) => {
    if (lower.includes(name) && !found.includes(MAG7_TICKERS[i])) {
      // Map name to ticker
      const tickerMap = {
        'nvidia': 'NVDA', 'apple': 'AAPL', 'microsoft': 'MSFT',
        'google': 'GOOGL', 'alphabet': 'GOOGL', 'amazon': 'AMZN',
        'meta': 'META', 'facebook': 'META', 'tesla': 'TSLA'
      };
      if (tickerMap[name] && !found.includes(tickerMap[name])) {
        found.push(tickerMap[name]);
      }
    }
  });
  
  return [...new Set(found)];
}

// Simple sentiment analysis
function analyzeSentiment(title, content = '') {
  const text = (title + ' ' + content).toLowerCase();
  
  const bullish = ['surge', 'soar', 'jump', 'rally', 'gain', 'rise', 'beat', 'exceed', 
    'upgrade', 'buy', 'bullish', 'record', 'high', 'growth', 'profit', 'strong',
    'success', 'breakthrough', 'deal', 'partnership', 'launch', 'innovation'];
  
  const bearish = ['fall', 'drop', 'plunge', 'crash', 'decline', 'loss', 'miss',
    'downgrade', 'sell', 'bearish', 'low', 'weak', 'concern', 'risk', 'warning',
    'lawsuit', 'investigation', 'layoff', 'cut', 'fail', 'delay', 'recall'];
  
  let score = 0;
  bullish.forEach(word => { if (text.includes(word)) score++; });
  bearish.forEach(word => { if (text.includes(word)) score--; });
  
  if (score >= 2) return { rating: 'BULLISH', emoji: '🟢', score };
  if (score <= -2) return { rating: 'BEARISH', emoji: '🔴', score };
  return { rating: 'NEUTRAL', emoji: '🟡', score };
}

// Fetch all feeds
async function fetchFeeds() {
  const articles = [];
  
  for (const feed of FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const item of result.items || []) {
        const tickers = getMentionedTickers(item.title + ' ' + (item.contentSnippet || ''));
        if (tickers.length > 0) {
          articles.push({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
            source: feed.name,
            tickers,
            sentiment: analyzeSentiment(item.title, item.contentSnippet),
            snippet: item.contentSnippet?.slice(0, 200) || ''
          });
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${feed.name}:`, err.message);
    }
  }
  
  return articles;
}

// Generate markdown digest
function generateDigest(articles, date) {
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toLocaleTimeString('en-US', { hour12: false });
  
  let md = `# Mag 7 News Feed\n\n`;
  md += `**Generated:** ${dateStr} ${timeStr} | **Articles:** ${articles.length}\n\n`;
  md += `---\n\n`;
  
  // Group by ticker
  const byTicker = {};
  MAG7_TICKERS.filter(t => t !== 'GOOG').forEach(t => byTicker[t] = []);
  
  articles.forEach(a => {
    a.tickers.forEach(t => {
      if (byTicker[t]) byTicker[t].push(a);
    });
  });
  
  // Summary table
  md += `## Summary\n\n`;
  md += `| Ticker | Articles | Sentiment |\n`;
  md += `|--------|----------|----------|\n`;
  
  for (const [ticker, items] of Object.entries(byTicker)) {
    const bullish = items.filter(i => i.sentiment.rating === 'BULLISH').length;
    const bearish = items.filter(i => i.sentiment.rating === 'BEARISH').length;
    const neutral = items.length - bullish - bearish;
    
    let sentiment = '🟡 Neutral';
    if (bullish > bearish + 1) sentiment = '🟢 Bullish';
    else if (bearish > bullish + 1) sentiment = '🔴 Bearish';
    
    md += `| **${ticker}** | ${items.length} | ${sentiment} |\n`;
  }
  
  md += `\n---\n\n`;
  
  // Latest headlines
  md += `## Latest Headlines\n\n`;
  
  const sorted = articles.sort((a, b) => b.pubDate - a.pubDate).slice(0, 30);
  
  sorted.forEach(a => {
    const time = a.pubDate.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false 
    });
    md += `### ${a.sentiment.emoji} ${a.title}\n\n`;
    md += `**${a.tickers.join(', ')}** | ${a.source} | ${time}\n\n`;
    if (a.snippet) md += `> ${a.snippet}...\n\n`;
    md += `[Read more](${a.link})\n\n`;
    md += `---\n\n`;
  });
  
  return md;
}

// Main function
async function run() {
  console.log(`[${new Date().toISOString()}] RSS Monitor starting...`);
  
  const state = await loadState();
  const articles = await fetchFeeds();
  
  // Filter out seen articles
  const newArticles = articles.filter(a => !state.seen[a.link]);
  
  console.log(`Found ${articles.length} total, ${newArticles.length} new`);
  
  if (newArticles.length > 0) {
    // Generate digest
    const digest = generateDigest(articles, new Date());
    const filename = `rss-feed-${new Date().toISOString().split('T')[0]}.md`;
    await fs.writeFile(path.join(RESEARCH_DIR, filename), digest);
    console.log(`Saved digest to ${filename}`);
    
    // Update seen
    newArticles.forEach(a => { state.seen[a.link] = Date.now(); });
    
    // Cleanup old seen entries (>7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const [url, ts] of Object.entries(state.seen)) {
      if (ts < weekAgo) delete state.seen[url];
    }
  }
  
  state.lastRun = Date.now();
  await saveState(state);
  
  console.log(`[${new Date().toISOString()}] Done.`);
}

// Run immediately if called directly
if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run };
