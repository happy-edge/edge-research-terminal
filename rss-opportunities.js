#!/usr/bin/env node
/**
 * RSS Opportunity Scanner
 * Scans news for ANY stock that could benefit from recent news
 * Identifies bullish catalysts across the market
 */

const Parser = require('rss-parser');
const fs = require('fs').promises;
const path = require('path');

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'EdgeTerminal/1.0' }
});

// Broader news feeds
const FEEDS = [
  { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC', name: 'Yahoo S&P500' },
  { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', name: 'CNBC Top' },
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', name: 'CNBC Tech' },
  { url: 'https://www.cnbc.com/id/15839135/device/rss/rss.html', name: 'CNBC Markets' },
  { url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch' },
  { url: 'https://feeds.marketwatch.com/marketwatch/StocksToWatch/', name: 'MW Stocks to Watch' },
];

// Common ticker pattern (1-5 uppercase letters)
const TICKER_REGEX = /\b([A-Z]{1,5})\b/g;

// Filter out common words that look like tickers
const FALSE_POSITIVES = new Set([
  'A', 'I', 'CEO', 'CFO', 'IPO', 'ETF', 'GDP', 'CPI', 'FED', 'SEC', 'FDA', 'AI', 'EV',
  'US', 'UK', 'EU', 'USD', 'EUR', 'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU',
  'ALL', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'HAS', 'HIS', 'HOW', 'ITS',
  'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'BOY', 'DID', 'GET', 'HIM', 'LET',
  'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CEO', 'CTO', 'COO', 'CMO', 'NYSE', 'NASDAQ',
  'AM', 'PM', 'TV', 'PC', 'IT', 'OR', 'BY', 'TO', 'IN', 'IS', 'ON', 'AT', 'AS', 'IF',
  'UP', 'SO', 'NO', 'GO', 'MY', 'AN', 'BE', 'WE', 'VS', 'Q1', 'Q2', 'Q3', 'Q4', 'YOY',
  'MOM', 'QOQ', 'P', 'E', 'PE', 'EPS', 'API', 'CEO', 'USA', 'UK', 'EST', 'PST',
]);

// Bullish keywords
const BULLISH_WORDS = [
  'surge', 'soar', 'jump', 'rally', 'gain', 'rise', 'beat', 'exceed', 'upgrade',
  'buy', 'bullish', 'record', 'high', 'growth', 'profit', 'strong', 'success',
  'breakthrough', 'deal', 'partnership', 'launch', 'innovation', 'revenue',
  'earnings beat', 'raises guidance', 'price target', 'outperform', 'acquisition',
  'dividend', 'buyback', 'approval', 'fda approval', 'contract', 'expansion'
];

// Bearish keywords
const BEARISH_WORDS = [
  'fall', 'drop', 'plunge', 'crash', 'decline', 'loss', 'miss', 'downgrade',
  'sell', 'bearish', 'low', 'weak', 'concern', 'risk', 'warning', 'lawsuit',
  'investigation', 'layoff', 'cut', 'fail', 'delay', 'recall', 'disappointing',
  'underperform', 'downside', 'debt', 'bankruptcy', 'fraud', 'scandal'
];

function extractTickers(text) {
  const matches = text.match(TICKER_REGEX) || [];
  return [...new Set(matches.filter(t => !FALSE_POSITIVES.has(t) && t.length >= 2))];
}

function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  let bullScore = 0;
  let bearScore = 0;
  
  BULLISH_WORDS.forEach(word => {
    if (lower.includes(word)) bullScore++;
  });
  
  BEARISH_WORDS.forEach(word => {
    if (lower.includes(word)) bearScore++;
  });
  
  const netScore = bullScore - bearScore;
  
  if (netScore >= 2) return { rating: 'STRONG_BUY', emoji: '🟢🟢', score: netScore };
  if (netScore >= 1) return { rating: 'BUY', emoji: '🟢', score: netScore };
  if (netScore <= -2) return { rating: 'AVOID', emoji: '🔴🔴', score: netScore };
  if (netScore <= -1) return { rating: 'CAUTION', emoji: '🔴', score: netScore };
  return { rating: 'NEUTRAL', emoji: '🟡', score: netScore };
}

async function scanFeeds() {
  const opportunities = [];
  
  for (const feed of FEEDS) {
    try {
      console.log(`Scanning ${feed.name}...`);
      const result = await parser.parseURL(feed.url);
      
      for (const item of (result.items || []).slice(0, 20)) {
        const text = `${item.title} ${item.contentSnippet || ''}`;
        const tickers = extractTickers(text);
        const sentiment = analyzeSentiment(text);
        
        // Only interested in bullish news with identifiable tickers
        if (tickers.length > 0 && sentiment.score >= 1) {
          opportunities.push({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || Date.now()),
            source: feed.name,
            tickers,
            sentiment,
            snippet: (item.contentSnippet || '').slice(0, 300)
          });
        }
      }
    } catch (err) {
      console.error(`Failed ${feed.name}:`, err.message);
    }
  }
  
  return opportunities;
}

function generateReport(opportunities) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  
  // Aggregate by ticker
  const byTicker = {};
  opportunities.forEach(opp => {
    opp.tickers.forEach(ticker => {
      if (!byTicker[ticker]) {
        byTicker[ticker] = { mentions: 0, totalScore: 0, headlines: [] };
      }
      byTicker[ticker].mentions++;
      byTicker[ticker].totalScore += opp.sentiment.score;
      byTicker[ticker].headlines.push({
        title: opp.title,
        source: opp.source,
        score: opp.sentiment.score
      });
    });
  });
  
  // Sort by total score
  const ranked = Object.entries(byTicker)
    .map(([ticker, data]) => ({
      ticker,
      mentions: data.mentions,
      avgScore: (data.totalScore / data.mentions).toFixed(1),
      totalScore: data.totalScore,
      headlines: data.headlines.slice(0, 3)
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 20);
  
  let md = `# 📈 Opportunity Scanner\n\n`;
  md += `**Scanned:** ${dateStr} ${timeStr} | **Bullish Signals:** ${opportunities.length}\n\n`;
  md += `---\n\n`;
  
  md += `## Top Opportunities\n\n`;
  md += `| Rank | Ticker | Mentions | Avg Score | Signal |\n`;
  md += `|------|--------|----------|-----------|--------|\n`;
  
  ranked.forEach((r, i) => {
    const signal = r.avgScore >= 2 ? '🟢🟢 STRONG' : r.avgScore >= 1 ? '🟢 BUY' : '🟡 WATCH';
    md += `| ${i + 1} | **${r.ticker}** | ${r.mentions} | +${r.avgScore} | ${signal} |\n`;
  });
  
  md += `\n---\n\n`;
  md += `## Headlines by Ticker\n\n`;
  
  ranked.slice(0, 10).forEach(r => {
    md += `### ${r.ticker}\n\n`;
    r.headlines.forEach(h => {
      md += `- **${h.title}** _(${h.source}, +${h.score})_\n`;
    });
    md += `\n`;
  });
  
  md += `---\n\n`;
  md += `_Note: This is automated news sentiment analysis, not financial advice. Always do your own research._\n`;
  
  return md;
}

async function run() {
  console.log(`[${new Date().toISOString()}] Opportunity Scanner starting...`);
  
  const opportunities = await scanFeeds();
  console.log(`Found ${opportunities.length} bullish signals`);
  
  if (opportunities.length > 0) {
    const report = generateReport(opportunities);
    const filename = `opportunities-${new Date().toISOString().split('T')[0]}.md`;
    const outPath = path.join(__dirname, 'research', filename);
    
    await fs.mkdir(path.join(__dirname, 'research'), { recursive: true });
    await fs.writeFile(outPath, report);
    console.log(`Saved to ${filename}`);
  }
  
  console.log(`[${new Date().toISOString()}] Done.`);
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run };
