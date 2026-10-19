import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createConfig } from '../src/adapter.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicFiles = [
  '.gitattributes', '.gitignore', 'CHANGELOG.md', 'LICENSE', 'README.md',
  'THIRD_PARTY_NOTICES.md', 'docs/guide.md', 'ocs-deepseek.json', 'package.json',
  'scripts/build.mjs', 'scripts/verify-publication.mjs', 'src/adapter.mjs', 'test/adapter.test.mjs'
];
const files = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'coverage'].includes(entry.name)) continue;
    const target = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (!entry.name.endsWith('.local.json') && !entry.name.endsWith('.log')) files.push(path.relative(root, target).replaceAll('\\', '/'));
  }
}
walk(root);
assert.deepEqual(files.sort(), [...publicFiles].sort(), 'Unexpected public file: inspect before publishing');
for (const name of files) {
  const content = fs.readFileSync(path.join(root, name), 'utf8');
  assert(!/\bsk-[a-zA-Z0-9_-]{16,}\b/.test(content), `Possible API key in ${name}`);
  assert(!/\b(?:ghp|gho|github_pat)_[a-zA-Z0-9_]{20,}\b/.test(content), `Possible GitHub token in ${name}`);
  assert(!/https?:\/\/[^\s"'<>]*(?:[?&](?:courseid|clazzid|cpi|enc)=)/i.test(content), `Account URL in ${name}`);
  assert(!content.includes('C:' + '\\Users\\') && !content.includes('D:' + '\\Codex\\'), `Local user path in ${name}`);
}
const artifact = JSON.parse(fs.readFileSync(path.join(root, 'ocs-deepseek.json'), 'utf8'));
assert.deepEqual(artifact, createConfig());
assert.equal(artifact[0].headers.Authorization, 'Bearer REPLACE_WITH_YOUR_DEEPSEEK_API_KEY');
const guide = fs.readFileSync(path.join(root, 'docs/guide.md'), 'utf8');
const configBlock = guide.match(/```json\n(\[\n[\s\S]*?)\n```/);
assert(configBlock, 'Full configuration appendix missing');
assert.deepEqual(JSON.parse(configBlock[1]), artifact, 'Guide configuration differs from build');
assert(fs.readFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8').includes('2022 enncy'));
assert(fs.readFileSync(path.join(root, 'README.md'), 'utf8').includes('非官方'));
console.log(`PASS: ${files.length} allowlisted public files; placeholders, provenance, and guide/config parity verified.`);
