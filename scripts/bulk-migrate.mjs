import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectRoot = process.cwd();
const sourceDir = '/tmp/pitcar-backup';
const targetDir = path.join(projectRoot, 'src/data/post');
const imageDir = path.join(projectRoot, 'src/assets/images/uploads');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Get list of existing images to check 404s
const availableImages = new Set(fs.readdirSync(imageDir).map(f => f.toLowerCase()));

const files = fs.readdirSync(sourceDir);
console.log(`Starting bulk migration of ${files.length} files...`);

let migratedCount = 0;

for (const file of files) {
  if (!file.endsWith('.md')) continue;

  const fullPath = path.join(sourceDir, file);
  const rawContent = fs.readFileSync(fullPath, 'utf8');
  let { data, content } = matter(rawContent);

  // 1. Filename & Canonical Logic
  // Extract date and keyword from filename YYYY-MM-DD-keyword.md
  // Some might be YYYY-MM-DD-id-XXXX.md or other formats
  const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  let keyword = '';
  if (match) {
    keyword = match[2];
  } else {
    keyword = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  }

  // 2. Fix Canonical URL
  if (data.metadata && data.metadata.canonical) {
    data.metadata.canonical = `https://pitcar.co.id/${keyword}/`;
  }

  // 3. Fix publishDate (ensure it's not a quoted string if possible, or handle it in regex later)
  // Gray-matter stringify will handle objects well.
  if (typeof data.publishDate === 'string') {
    data.publishDate = new Date(data.publishDate);
  }

  // 4. Handle Images in Content
  // Replace WP URLs and check if exists
  const remotePlaceholder = 'https://placehold.co/1200x800/222222/FFFFFF/png?text=Pitcar+Service';
  
  content = content.replace(/!\(https:\/\/pitcar\.co\.id\/images\/uploads\/\d{4}\/\d{2}\/([^)]+)\)/g, (match, fileName) => {
    if (availableImages.has(fileName.toLowerCase())) {
      return `![image](~/assets/images/uploads/${fileName})`;
    } else {
      // Image missing - Use remote placeholder
      return `![image](${remotePlaceholder})`;
    }
  });

  // Handle standard markdown links with images
  content = content.replace(/\[!\(https:\/\/pitcar\.co\.id\/images\/uploads\/\d{4}\/\d{2}\/([^)]+)\)\]\(([^)]+)\)/g, (match, fileName, link) => {
    if (availableImages.has(fileName.toLowerCase())) {
        return `[![image](~/assets/images/uploads/${fileName})](${link})`;
    } else {
        return `[![image](${remotePlaceholder})](${link})`;
    }
  });

  // 5. Handle Frontmatter 'image' field
  if (data.image && data.image.includes('pitcar.co.id/images/uploads/')) {
    const fileName = path.basename(data.image);
    if (availableImages.has(fileName.toLowerCase())) {
        data.image = `~/assets/images/uploads/${fileName}`;
    } else {
        data.image = remotePlaceholder;
    }
  }

  // Write new file
  try {
    const newFileName = `${keyword}.md`;
    const newContent = matter.stringify(content, data);
    fs.writeFileSync(path.join(targetDir, newFileName), newContent);
    migratedCount++;
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

console.log(`Bulk migration complete. Total migrated: ${migratedCount}`);
