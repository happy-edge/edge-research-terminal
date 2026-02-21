const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3847;
const RESEARCH_DIR = path.join(__dirname, '..', 'research');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get list of all research reports
app.get('/api/reports', async (req, res) => {
  try {
    const files = await fs.readdir(RESEARCH_DIR);
    const reports = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(RESEARCH_DIR, file);
        const stat = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extract title from first H1
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        
        // Extract company tags
        const tickers = [];
        const tickerPatterns = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'];
        for (const ticker of tickerPatterns) {
          if (content.includes(ticker) || file.toLowerCase().includes(ticker.toLowerCase())) {
            tickers.push(ticker);
          }
        }
        
        reports.push({
          id: file.replace('.md', ''),
          filename: file,
          title,
          tickers,
          createdAt: stat.birthtime,
          updatedAt: stat.mtime,
          size: stat.size
        });
      }
    }
    
    // Sort by updated date, newest first
    reports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single report content
app.get('/api/reports/:id', async (req, res) => {
  try {
    const filePath = path.join(RESEARCH_DIR, `${req.params.id}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    const html = marked(content);
    const stat = await fs.stat(filePath);
    
    res.json({
      id: req.params.id,
      content,
      html,
      updatedAt: stat.mtime
    });
  } catch (err) {
    res.status(404).json({ error: 'Report not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`📊 Research Dashboard running on http://localhost:${PORT}`);
});
