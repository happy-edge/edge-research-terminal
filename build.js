#!/usr/bin/env node
/**
 * Build script - generates static JSON index from research markdown files
 * Run this before deploying, or via GitHub Actions
 */

const fs = require('fs');
const path = require('path');

const RESEARCH_DIR = path.join(__dirname, 'research');
const OUTPUT_FILE = path.join(__dirname, 'public', 'data', 'reports.json');

const MAG7_TICKERS = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];

function extractTickers(content, filename) {
  const tickers = [];
  const text = (content + ' ' + filename).toUpperCase();
  
  MAG7_TICKERS.forEach(ticker => {
    if (text.includes(ticker)) tickers.push(ticker);
  });
  
  return [...new Set(tickers)];
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled Report';
}

function build() {
  // Ensure directories exist
  fs.mkdirSync(path.join(__dirname, 'public', 'data'), { recursive: true });
  fs.mkdirSync(RESEARCH_DIR, { recursive: true });
  
  const files = fs.readdirSync(RESEARCH_DIR).filter(f => f.endsWith('.md'));
  
  const reports = files.map(file => {
    const filePath = path.join(RESEARCH_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const stat = fs.statSync(filePath);
    
    return {
      id: file.replace('.md', ''),
      filename: file,
      title: extractTitle(content),
      tickers: extractTickers(content, file),
      content: content,
      createdAt: stat.birthtime.toISOString(),
      updatedAt: stat.mtime.toISOString(),
      size: stat.size
    };
  });
  
  // Sort by date, newest first
  reports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(reports, null, 2));
  console.log(`Built ${reports.length} reports to ${OUTPUT_FILE}`);
}

build();
