import assert from 'node:assert/strict';
import { brandInfo, softwareProjects, publications, mediaItems, socialLinks } from '../src/data/projects.ts';
import { ui } from '../src/i18n/ui.ts';

// 1. Verify Brand
assert.ok(brandInfo.name.includes('AIToBox'), 'Brand name must include AIToBox');
assert.ok(brandInfo.slogan, 'Brand slogan must be set');

// 2. Verify Projects
assert.equal(softwareProjects.length, 4, 'Must have 4 software projects');
assert.ok(softwareProjects.some(p => p.id === 'atb-cmder'), 'ATBCmder missing');
assert.ok(softwareProjects.some(p => p.id === 'atb-clone'), 'ATBClone missing');
assert.ok(softwareProjects.some(p => p.id === 'atb-novel'), 'ATBNovel missing');
assert.ok(softwareProjects.some(p => p.id === 'atb-bard'), 'ATBard missing');

// 3. Verify Publications
assert.equal(publications.length, 2, 'Must have 2 publications');
assert.ok(publications.some(p => p.id === 'newsweekly'), 'newsweekly missing');
assert.ok(publications.some(p => p.id === 'atb-insight'), 'atb-insight missing');

// 4. Verify Media
assert.equal(mediaItems.length, 2, 'Must have 2 media items');
assert.ok(mediaItems.some(m => m.id === 'silicon-business-talk'), 'Silicon Business Talk missing');

// 5. Verify Social Links
assert.equal(socialLinks.length, 5, 'Must have 5 social links');
const platforms = socialLinks.map(s => s.platform);
['x', 'youtube', 'bilibili', 'zhihu', 'github'].forEach(p => {
  assert.ok(platforms.includes(p), `Missing platform ${p}`);
});

// 6. Verify i18n dictionary completeness
const zhKeys = Object.keys(ui.zh);
const enKeys = Object.keys(ui.en);
assert.equal(zhKeys.length, enKeys.length, 'zh and en UI keys must be identical in count');
zhKeys.forEach(key => {
  assert.ok(ui.en[key], `Missing en translation for key: ${key}`);
});

console.log('✓ All data and i18n validations passed successfully!');
