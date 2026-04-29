import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = path.join(ROOT, '秋叶原情报终端.html');
const DIST_DIR = path.join(ROOT, 'dist');
const OUT_HTML = path.join(DIST_DIR, 'index.html');

const html = fs.readFileSync(SRC_HTML, 'utf-8');

const inlined = html.replace(
  /<script\s+type="text\/babel"\s+src="([^"]+\.jsx)"\s*>\s*<\/script>/g,
  (_, src) => {
    const code = fs.readFileSync(path.join(ROOT, src), 'utf-8');
    return `<script type="text/babel" data-source="${src}">\n${code}\n</script>`;
  },
);

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(OUT_HTML, inlined, 'utf-8');

const sizeKB = (fs.statSync(OUT_HTML).size / 1024).toFixed(1);
console.log(`build ok -> ${path.relative(ROOT, OUT_HTML)} (${sizeKB} KB)`);
