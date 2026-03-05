import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postDir = './src/data/post';
const outputRedirectsCloudflare = './public/_redirects';
const vercelConfigPath = './vercel.json';

const stopWords = [
  'terdekat', 'murah', 'paling', 'lengkap', 'bagus', 'profesional', 'terbaik',
  'berkualitas', 'terpercaya', 'canggih', 'tercanggih', 'daerah', 'wilayah',
  'kota', 'di', 'dan', 'yang', 'dengan', 'untuk', 'merupakan', 'adalah',
  'panggilan', 'online', 'resmi', 'maupun', 'secara', '24-jam', 'dari'
];

const geolocations = ['purwokerto', 'cilacap', 'banyumas'];

function getSemanticSlug(slug) {
  let parts = slug.split('-');
  
  // Keep geo words, strip others from stopWords
  let cleanParts = parts.filter(p => {
    if (geolocations.includes(p.toLowerCase())) return true;
    if (stopWords.includes(p.toLowerCase())) return false;
    return true;
  });

  return cleanParts.join('-');
}

async function consolidate() {
  const files = fs.readdirSync(postDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const clusters = {};

  console.log(`Analyzing ${files.length} posts...`);

  for (const file of files) {
    const fullPath = path.join(postDir, file);
    const slug = file.replace(/\.(md|mdx)$/, '');
    const rawContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(rawContent);

    const semanticSlug = getSemanticSlug(slug);
    
    if (!clusters[semanticSlug]) {
      clusters[semanticSlug] = [];
    }

    clusters[semanticSlug].push({
      file,
      slug,
      fullPath,
      contentLength: content.length,
      data,
      content
    });
  }

  const redirects = [];
  let deletedCount = 0;
  let masterCount = 0;

  for (const semanticSlug in clusters) {
    const group = clusters[semanticSlug];
    
    // Sort by content length descending
    group.sort((a, b) => b.contentLength - a.contentLength);

    const master = group[0];
    const masterSlug = master.slug; // Keep original slug of the "best" post for now or use semanticSlug? 
    // Let's use semanticSlug as the new Master Slug if it's clean
    const finalMasterSlug = semanticSlug;
    const finalMasterFile = `${finalMasterSlug}.md`;
    const finalMasterPath = path.join(postDir, finalMasterFile);

    masterCount++;

    // Process redirects for other posts in cluster
    for (let i = 1; i < group.length; i++) {
      const redundant = group[i];
      redirects.push({
        from: `/${redundant.slug}`,
        to: `/${finalMasterSlug}`
      });
      fs.unlinkSync(redundant.fullPath);
      deletedCount++;
    }

    // Rename Master if needed
    if (master.slug !== finalMasterSlug) {
      // If we are renaming, also redirect old master to new master
      redirects.push({
        from: `/${master.slug}`,
        to: `/${finalMasterSlug}`
      });
      
      // Update Master file
      const updatedContent = matter.stringify(master.content, {
          ...master.data,
          metadata: {
              ...master.data.metadata,
              canonical: `https://pitcar.co.id/${finalMasterSlug}`
          }
      });
      fs.writeFileSync(finalMasterPath, updatedContent);
      if (master.fullPath !== finalMasterPath && fs.existsSync(master.fullPath)) {
          fs.unlinkSync(master.fullPath);
      }
    } else {
        // Just ensure canonical is correct
        const updatedContent = matter.stringify(master.content, {
            ...master.data,
            metadata: {
                ...master.data.metadata,
                canonical: `https://pitcar.co.id/${finalMasterSlug}`
            }
        });
        fs.writeFileSync(finalMasterPath, updatedContent);
    }
  }

  console.log(`Consolidation complete.`);
  console.log(`Masters kept: ${masterCount}`);
  console.log(`Redundant deleted: ${deletedCount}`);

  // 1. Generate Cloudflare _redirects
  let cfRedirectContent = '';
  if (fs.existsSync(outputRedirectsCloudflare)) {
    cfRedirectContent = fs.readFileSync(outputRedirectsCloudflare, 'utf8');
  }
  
  redirects.forEach(r => {
    cfRedirectContent += `\n${r.from} ${r.to} 301`;
  });
  fs.writeFileSync(outputRedirectsCloudflare, cfRedirectContent);
  console.log(`Updated Cloudflare _redirects with ${redirects.length} new rules.`);

  // 2. Update Vercel redirects
  if (fs.existsSync(vercelConfigPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    if (!vercelConfig.redirects) vercelConfig.redirects = [];
    
    redirects.forEach(r => {
      // Remove trailing slashes for vercel source if needed, depends on config
      vercelConfig.redirects.push({
        source: r.from,
        destination: r.to,
        permanent: true
      });
    });
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    console.log(`Updated vercel.json with ${redirects.length} new rules.`);
  }
}

consolidate().catch(err => console.error(err));
