# WordPress → AstroWind Migration Prompt

> Paste this entire prompt into Claude, Cursor, or any AI coding assistant
> alongside your `/output` folder of exported WordPress Markdown files.

---

````
You are an expert Astro.js developer. I have exported my WordPress site to
Markdown files located in the `/output` folder. Each `.md` file represents
a post or page and contains frontmatter with WordPress metadata.

I will be using the **AstroWind** theme (https://github.com/onwidget/astrowind)
as the base. Your job is to migrate all content into AstroWind's exact
conventions — DO NOT invent a custom structure. Use AstroWind's built-in
collections, layouts, config system, and utilities as they are.

---

## STEP 1 — BOOTSTRAP ASTROWIND

```bash
npm create astro@latest -- --template onwidget/astrowind
cd my-site
npm install
````

Open `src/config.yaml` immediately — this is AstroWind's central config file.
Fill in the site name, URL, description, and blog settings before touching
anything else. Key sections to configure:

```yaml
site:
  name: "Your Site Name"
  site: "https://pitcar.co.id" # MUST match Astro's `site` in astro.config.ts
  base: "/"
  trailingSlash: false

  googleSiteVerificationId: "" # paste from Google Search Console

metadata: # msut match anything in export.xml
  title:
    default: "Your Site Name"
    template: "%s — Your Site Name"
  description: "Your site description from WP tagline"
  robots:
    index: true
    follow: true
  openGraph:
    site_name: "Your Site Name"
    images:
      - url: "~/assets/images/default-og.jpg"
        width: 1200
        height: 628
    type: website
  twitter:
    handle: "@yourhandle"
    site: "@yourhandle"
    cardType: summary_large_image

blog:
  isEnabled: true
  postsPerPage: 10
  isRelatedPostsEnabled: true
  relatedPostsCount: 4
  post:
    isEnabled: true
    permalink: "/%slug%" # adjust to match your old WP permalink structure
    robots:
      index: true
  list:
    isEnabled: true
    pathname: "blog"
    robots:
      index: true
  category:
    isEnabled: true
    pathname: "category"
    robots:
      index: true
  tag:
    isEnabled: true
    pathname: "tag"
    robots:
      index: true
  isAuthorDisplayed: true
  author:
    isEnabled: true
    pathname: "author"
    robots:
      index: true
```

---

## STEP 2 — ANALYZE SOURCE CONTENT

Before writing any conversion code, read ALL `.md` files in `/output` and catalogue:

1. Every frontmatter field present across all files (title, date, slug,
   categories, tags, author, excerpt, featuredImage, status, SEO fields, etc.)
2. All post types: blog posts vs static pages
3. Every category and tag used
4. All image paths and whether they are absolute WP URLs or relative paths
5. Internal links (old domain references)
6. Any Yoast/RankMath SEO fields:
   - `_yoast_wpseo_metadesc` → maps to `description` in AstroWind metadata
   - `_yoast_wpseo_canonical` → maps to `canonical` in metadata
   - `_yoast_wpseo_meta-robots-noindex` → maps to `robots.index: false`
   - `_rank_math_description` → maps to `description`
   - `_rank_math_canonical_url` → maps to `canonical`
7. Any shortcodes that need converting

---

## STEP 3 — ASTROWIND POST FRONTMATTER FORMAT

AstroWind's content collection lives in `src/content/post/`. The filename
becomes the slug. Each post's frontmatter must follow this exact structure:

```yaml
---
publishDate: 2023-04-15T00:00:00Z # maps from WP post_date
updateDate: 2023-06-01T00:00:00Z # maps from WP post_modified (optional)
title: "Your Post Title"
excerpt: "Short description shown in post cards and as meta description fallback"
image: ~/assets/images/posts/your-image.jpg # featured image
category: "Category Name" # AstroWind uses a single category string
tags:
  - tag-one
  - tag-two
author: "Author Name"
draft: false # set true for non-published WP posts
metadata:
  title: "SEO Title (if different from post title)"
  description: "Meta description — map from Yoast/RankMath field"
  canonical: "https://yournewdomain.com/your-post-slug/"
  robots:
    index: true
    follow: true
  openGraph:
    images:
      - url: ~/assets/images/posts/your-image.jpg
---
```

**Important AstroWind field notes:**

- `category` is a **single string**, not an array — if the WP post has multiple
  categories, pick the primary one and add the rest as `tags`
- `image` path uses the `~/assets/images/` alias — images must be copied there
- `metadata.description` takes priority over `excerpt` for the `<meta description>` tag
- `metadata.canonical` explicitly sets the canonical URL — always populate this
  from the original WP URL to preserve link equity during migration
- `draft: true` posts are excluded from builds — use for WP drafts or private posts

---

## STEP 4 — MIGRATE ALL MARKDOWN FILES

Write a Node.js script `scripts/migrate.mjs` to automate this:

```js
import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

const INPUT_DIR = "../output";
const OUTPUT_DIR = "./src/content/post";
const OLD_DOMAIN = "https://oldwordpresssite.com";
const NEW_DOMAIN = "https://yournewdomain.com";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = glob.sync(`${INPUT_DIR}/**/*.md`);

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const { data: wp, content } = matter(raw);

  // Skip non-published posts
  if (wp.post_status && wp.post_status !== "publish") continue;

  // Derive slug from WP post_name or filename
  const slug = wp.post_name || path.basename(file, ".md");

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
    t.toLowerCase().replace(/\s+/g, "-"),
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

  const output = matter.stringify(fixedContent, newFrontmatter);
  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), output);
  console.log(`✓ Migrated: ${slug}`);
}

console.log("Migration complete.");
```

Run it:

```bash
npm install gray-matter glob
node scripts/migrate.mjs
```

---

## STEP 5 — MIGRATE IMAGES

Copy all WordPress uploaded images into AstroWind's assets folder:

```bash
# If you have the original WP uploads folder:
cp -r /path/to/wp-content/uploads/ src/assets/images/uploads/

# If images are still referenced as absolute URLs in the markdown,
# run this to download them all:
grep -rh 'src/content/post/' -e '!\[' | grep -oP 'https?://[^\s\)\"]+\.(jpg|jpeg|png|gif|webp)' \
  | sort -u > image-urls.txt

# Then use wget or curl to batch download:
mkdir -p src/assets/images/uploads
while IFS= read -r url; do
  wget -q -P src/assets/images/uploads/ "$url"
done < image-urls.txt
```

AstroWind uses Astro Assets + Unpic for image optimization. Images stored in
`src/assets/` are automatically optimized at build time. Images in `public/`
are served as-is. Prefer `src/assets/` for all post images.

---

## STEP 6 — PRESERVE URL STRUCTURE (CRITICAL FOR SEO)

AstroWind controls blog URL patterns via `src/config.yaml` under `blog.post.permalink`.
Match your old WP permalink setting:

| WP Permalink Setting                   | AstroWind `permalink` value         |
| -------------------------------------- | ----------------------------------- |
| `/%postname%/`                         | `'/%slug%'`                         |
| `/%category%/%postname%/`              | `'/%category%/%slug%'`              |
| `/%year%/%monthnum%/%day%/%postname%/` | `'/%year%/%monthnum%/%day%/%slug%'` |
| `/%year%/%monthnum%/%postname%/`       | `'/%year%/%monthnum%/%slug%'`       |

If you are changing the URL structure, add 301 redirects (see Step 9).

---

## STEP 7 — STATIC PAGES (About, Contact, Services, etc.)

AstroWind static pages are NOT content collection entries — they live in
`src/pages/` as `.astro` files. For each WP static page:

1. Create `src/pages/your-page-slug.astro`
2. Use AstroWind's `PageLayout` and metadata system:

```astro
---
import Layout from '~/layouts/PageLayout.astro';

const metadata = {
  title: 'About Us',
  description: 'Meta description from WP Yoast field',
  canonical: 'https://yournewdomain.com/about/',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    images: [{ url: '~/assets/images/about-og.jpg' }],
  },
};
---

<Layout metadata={metadata}>
  <!-- paste converted page content here -->
  <section class="px-4 py-16 mx-auto max-w-3xl prose dark:prose-invert">
    <h1>About Us</h1>
    <p>Your page content...</p>
  </section>
</Layout>
```

---

## STEP 8 — VERIFY BUILT-IN SEO FEATURES

AstroWind's `MetaTags.astro` component (injected via `Layout.astro`)
automatically renders for every page:

- `<title>` using `metadata.title` or the `title` template from `config.yaml`
- `<meta name="description">` from `metadata.description`
- `<link rel="canonical">` from `metadata.canonical` (or auto-generated)
- Full Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- Twitter Card meta tags
- `<meta name="robots">` respecting `robots.index` / `robots.follow`
- JSON-LD structured data for blog posts (BlogPosting schema)
- Automatic sitemap via `@astrojs/sitemap` (already integrated)
- RSS feed at `/rss.xml` (already integrated via `src/pages/rss.xml.ts`)

You do NOT need to build a custom SEO component — AstroWind's system handles
all of this. Your only job is to populate `metadata` correctly in frontmatter
and in `config.yaml`.

---

## STEP 9 — REDIRECTS FOR OLD WP URLS

Create `public/_redirects` for Netlify, or `vercel.json` for Vercel.

**Netlify (`public/_redirects`):**

```
# Feed redirects
/feed/              /rss.xml            301
/feed/rss/          /rss.xml            301
/feed/rss2/         /rss.xml            301
/comments/feed/     /rss.xml            301

# Block WP admin URLs
/wp-admin/*         /                   301
/wp-login.php       /                   301
/xmlrpc.php         /                   410

# If old WP used date-based URLs and new site uses /%slug%/:
# Add individual redirects per post, or use a wildcard:
/2023/04/15/my-post/    /my-post/       301
```

**Vercel (`vercel.json`):**

```json
{
  "redirects": [
    { "source": "/feed", "destination": "/rss.xml", "permanent": true },
    { "source": "/feed/", "destination": "/rss.xml", "permanent": true },
    { "source": "/wp-admin/:path*", "destination": "/", "permanent": true },
    { "source": "/wp-login.php", "destination": "/", "permanent": true }
  ]
}
```

---

## STEP 10 — ROBOTS.TXT

Replace `public/robots.txt` content with:

```
User-agent: *
Allow: /

Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /?s=
Disallow: /search/

Sitemap: https://yournewdomain.com/sitemap-index.xml
```

---

## STEP 11 — ANALYTICS & TRACKING

AstroWind supports Google Analytics and other scripts via `src/config.yaml`:

```yaml
analytics:
  vendors:
    googleAnalytics:
      id: "G-XXXXXXXXXX" # paste your GA4 measurement ID
```

For other scripts (GTM, Hotjar, etc.), add them in `src/components/CustomStyles.astro`
or create a `src/components/Analytics.astro` component and import it in
`src/layouts/Layout.astro`.

---

## STEP 12 — FINAL MIGRATION CHECKLIST

Run through this before launching:

**Content**

- [ ] All published WP posts are in `src/content/post/` as `.md` files
- [ ] Filenames match original WP slugs exactly
- [ ] `publishDate` and `updateDate` are correctly set
- [ ] `category` is a single string (not an array)
- [ ] No remaining `[shortcode]` tags in content
- [ ] All internal links use new domain or relative paths
- [ ] All images exist in `src/assets/images/` and paths use `~/assets/images/`

**SEO**

- [ ] `metadata.description` populated for every post (not just `excerpt`)
- [ ] `metadata.canonical` set on every post and page
- [ ] `metadata.robots.index: false` applied to any originally noindex WP posts
- [ ] `src/config.yaml` — `site.site` matches production domain exactly
- [ ] `src/config.yaml` — `metadata.title.template` is correct
- [ ] Open Graph image specified in `config.yaml` and per-post where applicable

**Technical**

- [ ] `npm run build` completes with zero errors
- [ ] `sitemap-index.xml` accessible at `/sitemap-index.xml`
- [ ] `rss.xml` accessible at `/rss.xml`
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] All blog post URLs match original WP URLs (or 301s are in place)
- [ ] Category pages render at `/category/[slug]/`
- [ ] Tag pages render at `/tag/[slug]/`
- [ ] 404 page (`src/pages/404.astro`) is customized
- [ ] Dark mode toggle works correctly

**Post-launch**

- [ ] Submit new sitemap to Google Search Console
- [ ] Verify all old URLs in Search Console are either preserved or 301 redirected
- [ ] Test 5–10 representative posts with Google Rich Results Test
- [ ] Run Lighthouse on homepage and a post page — target 90+ all categories

---

## REFERENCE: ASTROWIND KEY FILES TO KNOW

| File                                | Purpose                                                   |
| ----------------------------------- | --------------------------------------------------------- |
| `src/config.yaml`                   | Site name, URL, blog config, analytics, metadata defaults |
| `src/content/post/`                 | All blog post `.md` / `.mdx` files                        |
| `src/content/config.ts`             | Zod schema for the post collection                        |
| `src/pages/[...blog]/`              | Blog routing — DO NOT modify unless needed                |
| `src/pages/index.astro`             | Homepage — customize widgets here                         |
| `src/components/CustomStyles.astro` | Global CSS overrides and custom head scripts              |
| `src/layouts/Layout.astro`          | Root layout — wraps all pages, injects MetaTags           |
| `src/layouts/PageLayout.astro`      | Layout for static pages                                   |
| `src/utils/blog.ts`                 | Blog utility functions (getStaticPaths, etc.)             |
| `public/_headers`                   | HTTP security headers (already configured)                |
| `public/robots.txt`                 | Robots rules                                              |

Now proceed step by step. Start with Step 1 (bootstrap + config.yaml), then
Step 2 (analyze content), then run the migration script in Step 4. Do not
customize the theme visually until all content is migrated and verified.

```

```
