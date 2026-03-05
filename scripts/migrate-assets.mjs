import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, 'output');
const targetImageDir = path.join(projectRoot, 'src/assets/images/uploads');
const postDir = path.join(projectRoot, 'src/data/post');

// Ensure target dir exists
if (!fs.existsSync(targetImageDir)) {
  fs.mkdirSync(targetImageDir, { recursive: true });
}

// 1. Migrate Images
console.log('Finding images in output directory...');
const imageFiles = globSync('**/*.{jpg,jpeg,png,webp,gif}', { cwd: outputDir });

console.log(`Found ${imageFiles.length} images. Copying to src/assets/images/uploads...`);
const imageMap = new Map(); // Store filename to local path map if needed

for (const imgPath of imageFiles) {
  const fileName = path.basename(imgPath);
  const src = path.join(outputDir, imgPath);
  const dest = path.join(targetImageDir, fileName);
  
  // Simple copy (might overwrite if same filename in different WP folders, but likely okay for now)
  fs.copyFileSync(src, dest);
  imageMap.set(fileName.toLowerCase(), fileName);
}

// 2. Update Posts
const postFiles = fs.readdirSync(postDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of postFiles) {
  const fullPath = path.join(postDir, file);
  let rawContent = fs.readFileSync(fullPath, 'utf8');
  
  // Fix publishDate string to unquoted date in YAML
  // Find publishDate: '...' and replace with publishDate: ...
  rawContent = rawContent.replace(/publishDate:\s*['"]([^'"]+)['"]/g, 'publishDate: $1');
  
  // Update image URLs
  // WordPress style URLs: https://pitcar.co.id/images/uploads/YYYY/MM/filename.jpg
  // Or: !(https://...)
  
  // Replace !(URL) with ![image](~/assets/images/uploads/filename)
  rawContent = rawContent.replace(/!\(https:\/\/pitcar\.co\.id\/images\/uploads\/\d{4}\/\d{2}\/([^)]+)\)/g, (match, fileName) => {
    return `![image](~/assets/images/uploads/${fileName})`;
  });

  // Replace standard markdown links [!(URL)](...)
  rawContent = rawContent.replace(/\[!\(https:\/\/pitcar\.co\.id\/images\/uploads\/\d{4}\/\d{2}\/([^)]+)\)\]/g, (match, fileName) => {
      return `[![image](~/assets/images/uploads/${fileName})]`;
  });

  // Also replace any URLs in frontmatter 'image' field or metadata
  const { data, content } = matter(rawContent);
  
  if (data.image && data.image.includes('pitcar.co.id/images/uploads/')) {
    const fileName = path.basename(data.image);
    data.image = `~/assets/images/uploads/${fileName}`;
  }

  // Final write back
  // Using matter.stringify often quotes dates, so I'll do a final manual fix if needed or just use rawContent if I only did regex
  // Let's use regex for everything to avoid YAML re-formatting issues for now.
  
  fs.writeFileSync(fullPath, rawContent);
  console.log(`Updated post: ${file}`);
}

console.log('Migration complete.');
