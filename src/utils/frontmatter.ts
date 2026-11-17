import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};

/**
 * The post page already renders the title as its only h1. Migrated posts often
 * open with their own `# heading`, so when a post has any h1 every heading
 * moves down one level (h1→h2, h2→h3, …), keeping the outline intact.
 */
export const demoteHeadingsRemarkPlugin: RemarkPlugin = () => {
  return function (tree) {
    let hasH1 = false;
    visit(tree, 'heading', (node: { depth: number }) => {
      if (node.depth === 1) hasH1 = true;
    });
    if (!hasH1) return;
    visit(tree, 'heading', (node: { depth: number }) => {
      node.depth = Math.min(node.depth + 1, 6);
    });
  };
};
