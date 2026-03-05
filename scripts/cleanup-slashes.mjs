import fs from 'fs';
import path from 'path';

const vercelPath = './vercel.json';
const cfPath = './public/_redirects';
const postsDir = './src/data/post';

// 1. Cleanup Vercel
if (fs.existsSync(vercelPath)) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  if (vercel.redirects) {
    vercel.redirects = vercel.redirects.map(r => ({
      ...r,
      source: r.source.replace(/\/$/, '') || '/',
      destination: r.destination.replace(/\/$/, '') || '/'
    }));
    // Remove duplicates
    const unique = [];
    const seen = new Set();
    vercel.redirects.forEach(r => {
      const key = `${r.source}->${r.destination}`;
      if (!seen.has(key)) {
        unique.push(r);
        seen.add(key);
      }
    });
    vercel.redirects = unique;
    fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2));
    console.log('Cleaned vercel.json');
  }
}

// 2. Cleanup Cloudflare
if (fs.existsSync(cfPath)) {
  let lines = fs.readFileSync(cfPath, 'utf8').split('\n');
  let cleanLines = lines.map(line => {
    let parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      let from = parts[0].replace(/\/$/, '') || '/';
      let to = parts[1].replace(/\/$/, '') || '/';
      let status = parts[2] || '301';
      return `${from} ${to} ${status}`;
    }
    return line;
  });
  // Remove duplicates
  const seen = new Set();
  const finalLines = cleanLines.filter(line => {
    if (!line.trim()) return false;
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  });
  fs.writeFileSync(cfPath, finalLines.join('\n'));
  console.log('Cleaned public/_redirects');
}

// 3. Blog Posts (Already checked but double check)
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
files.forEach(file => {
  const p = path.join(postsDir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.match(/canonical: '.*.\/'/)) {
    content = content.replace(/(canonical: '.*.)\/'/g, '$1\'');
    fs.writeFileSync(p, content);
  }
});
console.log('Verified blog posts');
