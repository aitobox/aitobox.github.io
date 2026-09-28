import assert from 'node:assert/strict';
import { brandInfo, softwareProjects, publications, mediaItems, socialLinks } from '../src/data/projects.ts';
import { ui } from '../src/i18n/ui.ts';

// 1. Verify Brand
assert.ok(brandInfo.name.includes('AIToBox'), 'Brand name must include AIToBox');
assert.equal(brandInfo.slogan, '汇聚智能，启发未来', 'Brand slogan must match requested text');

// 2. Verify Projects
assert.equal(softwareProjects.length, 4, 'Must have 4 software projects');
const cmder = softwareProjects.find(p => p.id === 'atb-cmder');
assert.ok(cmder, 'ATBCmder missing');
assert.equal(cmder.github, undefined, 'ATBCmder is private commercial, must not have github source link');

const clone = softwareProjects.find(p => p.id === 'atb-clone');
assert.ok(clone && clone.github, 'ATBClone must have github link');
assert.equal(clone.url, 'https://clone.aitobox.com', 'ATBClone website must be https://clone.aitobox.com');

const novel = softwareProjects.find(p => p.id === 'atb-novel');
assert.ok(novel && novel.github, 'ATBNovel must have github link');

const bard = softwareProjects.find(p => p.id === 'atb-bard');
assert.ok(bard && bard.github, 'ATBard must have github link');

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

// 7. Verify getLocalizedPath
import { getLocalizedPath } from '../src/i18n/utils.ts';
assert.equal(getLocalizedPath('/', 'en'), '/en');
assert.equal(getLocalizedPath('/en', 'en'), '/en');
assert.equal(getLocalizedPath('/en/', 'en'), '/en/');
assert.equal(getLocalizedPath('/en', 'zh'), '/');
assert.equal(getLocalizedPath('/en/', 'zh'), '/');
assert.equal(getLocalizedPath('/en/about', 'zh'), '/about');
assert.equal(getLocalizedPath('/about', 'en'), '/en/about');
assert.equal(getLocalizedPath('/enterprise', 'zh'), '/enterprise');
assert.equal(getLocalizedPath('/enterprise', 'en'), '/en/enterprise');

console.log('✓ All data and i18n validations passed successfully!');
