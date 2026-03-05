import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const sourceDir = './src/content/post';
const targetDir = './src/data/post';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

for (const file of files) {
  if (!file.endsWith('.md')) continue;

  const fullPath = path.join(sourceDir, file);
  const rawContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(rawContent);

  // Extract date and keyword from filename YYYY-MM-DD-keyword.md
  const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (match) {
    const dateStr = match[1];
    const keyword = match[2];

    // Remove date from canonical
    if (data.metadata && data.metadata.canonical) {
      data.metadata.canonical = `https://pitcar.co.id/${keyword}/`;
    }

    // Write to new location with new name
    const newContent = matter.stringify(content, data);
    const newFileName = `${keyword}.md`;
    fs.writeFileSync(path.join(targetDir, newFileName), newContent);
    console.log(`Migrated and renamed: ${file} -> ${newFileName}`);
    
    // Remove old file
    fs.unlinkSync(fullPath);
  } else {
    console.log(`Skipping file with unexpected format: ${file}`);
  }
}
