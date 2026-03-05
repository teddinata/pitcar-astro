import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

const INPUT_DIR = "./output";
const OUTPUT_DIR = "./src/content/post";
const OLD_DOMAIN = "https://pitcar.co.id"; // Using the site domain from config
const NEW_DOMAIN = "https://pitcar.co.id";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Adjusted glob to handle the nested structure found (posts/YYYY/slug/index.md)
const files = glob.sync(`${INPUT_DIR}/posts/**/*.md`);

console.log(`Found ${files.length} files to process.`);

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const { data: wp, content } = matter(raw);

  // Skip non-published posts if status is present
  if (wp.post_status && wp.post_status !== "publish") continue;

  // Derive slug: Prefer WP post_name, then directory name, then filename
  const dirName = path.dirname(file).split(path.sep).pop();
  const slug = wp.post_name || (dirName !== 'posts' && dirName !== '2021' && dirName !== '2022' && dirName !== '2023' ? dirName : path.basename(file, ".md"));

  // Map category: take first WP category as primary
  const wpCategories = Array.isArray(wp.categories)
    ? wp.categories
    : wp.categories
      ? [wp.categories]
      : [];
  const primaryCategory = wpCategories[0] || "Uncategorized";
  const extraCategories = wpCategories.slice(1);

  // Map tags
  const wpTags = Array.isArray(wp.tags) ? wp.tags : wp.tags ? [wp.tags] : [];
  const allTags = [...wpTags, ...extraCategories].map((t) =>
    t.toLowerCase().trim().replace(/\s+/g, "-"),
  );

  // Resolve SEO fields (Yoast, RankMath, or fallback)
  const metaDescription =
    wp._yoast_wpseo_metadesc ||
    wp._rank_math_description ||
    wp.description ||
    wp.post_excerpt ||
    "";

  const canonical =
    wp._yoast_wpseo_canonical ||
    wp._rank_math_canonical_url ||
    `${NEW_DOMAIN}/${slug}/`;

  const noIndex =
    wp._yoast_wpseo_meta_robots_noindex === "1" ||
    wp._rank_math_robots?.includes("noindex") ||
    false;

  // Fix image path
  const rawImage =
    wp.post_thumbnail || wp.featuredImage || wp.featured_image || "";
  const image = rawImage
    ? rawImage.replace(/.*wp-content\/uploads\//, "~/assets/images/uploads/")
    : "";

  // Build AstroWind-compatible frontmatter
  const newFrontmatter = {
    publishDate: new Date(wp.post_date || wp.date || Date.now()).toISOString(),
    ...(wp.post_modified
      ? { updateDate: new Date(wp.post_modified).toISOString() }
      : {}),
    title: wp.title || wp.post_title || "Untitled",
    excerpt: wp.post_excerpt || wp.excerpt || metaDescription,
    ...(image ? { image } : {}),
    category: primaryCategory,
    ...(allTags.length ? { tags: allTags } : {}),
    ...(wp.author ? { author: wp.author } : {}),
    draft: false,
    metadata: {
      ...(metaDescription ? { description: metaDescription } : {}),
      canonical,
      robots: {
        index: !noIndex,
        follow: true,
      },
      ...(image ? { openGraph: { images: [{ url: image }] } } : {}),
    },
    // Preserve original WP ID for reference
    _wpId: wp.post_id || wp.ID || undefined,
  };

  // Fix internal links in content
  let fixedContent = content
    .replace(new RegExp(OLD_DOMAIN, "g"), NEW_DOMAIN)
    .replace(/\/wp-content\/uploads\//g, "/images/uploads/");

  // Convert common WP shortcodes
  fixedContent = fixedContent
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gs, "$1")
    .replace(/\[embed\](.*?)\[\/embed\]/g, "$1")
    .replace(
      /\[gallery[^\]]*\]/g,
      "<!-- gallery shortcode: replace manually -->",
    )
    .replace(/\[\/?\w+[^\]]*\]/g, ""); // strip remaining unknown shortcodes

  // Filter out undefined values to avoid js-yaml errors
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(newFrontmatter).filter(([_, v]) => v !== undefined)
  );

  const output = matter.stringify(fixedContent, cleanFrontmatter);
  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), output);
  console.log(`✓ Migrated: ${slug}`);
}

console.log("Migration complete.");
