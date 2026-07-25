/**
 * replace-urls.mjs
 * Replaces all hardcoded http://localhost:5000 URLs in src/ with
 * import.meta.env.VITE_API_URL (Vite env variable for Vercel deployment)
 *
 * Run once:  node replace-urls.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = './src';
const OLD_URL = 'http://localhost:5000';
let filesChanged = 0;

function replaceInFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  if (!content.includes(OLD_URL)) return;

  // 1. Replace inside template literals:  `http://localhost:5000/...`
  content = content.replace(
    /`http:\/\/localhost:5000/g,
    '`${import.meta.env.VITE_API_URL}'
  );

  // 2. Replace single-quoted full URL strings: 'http://localhost:5000/...'
  content = content.replace(
    /'http:\/\/localhost:5000([^']*)'/g,
    (_, path) => `\`\${import.meta.env.VITE_API_URL}${path}\``
  );

  // 3. Replace double-quoted full URL strings: "http://localhost:5000/..."
  content = content.replace(
    /"http:\/\/localhost:5000([^"]*)"/g,
    (_, path) => `\`\${import.meta.env.VITE_API_URL}${path}\``
  );

  writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Updated: ${filePath}`);
  filesChanged++;
}

function walkDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== '.git') {
      walkDir(fullPath);
    } else {
      const ext = extname(entry);
      if (ext === '.jsx' || ext === '.js' || ext === '.ts' || ext === '.tsx') {
        replaceInFile(fullPath);
      }
    }
  }
}

console.log('\n🔄 Replacing localhost:5000 URLs for Vercel deployment...\n');
walkDir(SRC_DIR);
console.log(`\n✨ Done! ${filesChanged} file(s) updated.\n`);
