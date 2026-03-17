import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = './src/data/post';

const stopwords = new Set([
  'dan',
  'yang',
  'untuk',
  'pada',
  'dengan',
  'ini',
  'itu',
  'dari',
  'ke',
  'di',
  'atau',
  'serta',
  'terbaik',
  'murah',
  'bagus',
  'profesional',
  'terpercaya',
  'terdekat',
  'the',
  'and',
  'or',
  'of',
  'to',
  'in',
  'on',
  'a',
  'an',
]);

const stripMarkdown = (value) => {
  let text = value;
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/`[^`]*`/g, ' ');
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/^>\s?/gm, '');
  text = text.replace(/^[-*+]\s+/gm, '');
  text = text.replace(/[*_~]/g, '');
  return text;
};

const clampDescription = (value, maxLength = 160) => {
  if (value.length <= maxLength) return value;
  const sliced = value.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace > 80) return sliced.slice(0, lastSpace).trim();
  return sliced.slice(0, maxLength).trim();
};

const buildDescription = (data, body) => {
  if (typeof data.excerpt === 'string' && data.excerpt.trim()) {
    return data.excerpt.trim();
  }
  const plain = stripMarkdown(body).replace(/\s+/g, ' ').trim();
  if (plain) return clampDescription(plain, 160);
  if (typeof data.title === 'string') return clampDescription(data.title.trim(), 160);
  return '';
};

const normalizeWords = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, ' ')
    .split(/\s+/)
    .map(word => word.trim())
    .filter(Boolean);

const findLocationWord = (words) => {
  for (let i = words.length - 1; i >= 0; i -= 1) {
    const word = words[i];
    if (word.length > 2 && !stopwords.has(word)) return word;
  }
  return '';
};

const pickBaseWords = (words, count, locationWord) => {
  const result = [];
  for (const word of words) {
    if (result.length >= count) break;
    if (word.length <= 2) continue;
    if (stopwords.has(word)) continue;
    if (locationWord && word === locationWord) continue;
    result.push(word);
  }
  return result;
};

const buildMainKeyword = (slug) => {
  const words = normalizeWords(slug);
  const locationWord = findLocationWord(words);
  const baseWords = pickBaseWords(words, words.length >= 4 ? 4 : 3, locationWord);
  const pieces = [...baseWords];
  if (locationWord && !pieces.includes(locationWord)) pieces.push(locationWord);
  return pieces.join(' ').trim();
};

const buildKeywords = (data, slug) => {
  const keywords = [];
  const seen = new Set();

  const addKeyword = (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    keywords.push(trimmed);
  };

  const mainKeyword = buildMainKeyword(slug);
  if (mainKeyword) {
    addKeyword(mainKeyword);
    addKeyword(`jasa ${mainKeyword}`);
    addKeyword(`bengkel ${mainKeyword}`);
    addKeyword(`service ${mainKeyword}`);
    addKeyword(`servis ${mainKeyword}`);
    addKeyword(`harga ${mainKeyword}`);
    addKeyword(`biaya ${mainKeyword}`);
  }

  return keywords.slice(0, 12).join(', ');
};

const ensureTrailingSlash = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.endsWith('/')) return trimmed;
  return `${trimmed}/`;
};

if (!fs.existsSync(postsDir)) {
  console.error(`Missing posts directory: ${postsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
let updatedCount = 0;

for (const file of files) {
  const fullPath = path.join(postsDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};
  const metadata = typeof data.metadata === 'object' && data.metadata !== null ? { ...data.metadata } : {};

  let changed = false;

  if (metadata.canonical) {
    const withSlash = ensureTrailingSlash(metadata.canonical);
    if (withSlash !== metadata.canonical) {
      metadata.canonical = withSlash;
      changed = true;
    }
  }

  if (!metadata.description || !String(metadata.description).trim()) {
    const description = buildDescription(data, parsed.content);
    if (description) {
      metadata.description = description;
      changed = true;
    }
  }

  const slug = path.basename(file, path.extname(file));
  const keywords = buildKeywords(data, slug);
  if (keywords && keywords !== metadata.keywords) {
    metadata.keywords = keywords;
    changed = true;
  }

  if (changed) {
    data.metadata = metadata;
    const output = matter.stringify(parsed.content, data, { lineWidth: 0 });
    fs.writeFileSync(fullPath, output);
    updatedCount += 1;
  }
}

console.log(`Updated ${updatedCount} post(s).`);
