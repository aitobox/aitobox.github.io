# AIToBox Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a modern, adaptive dark/light, dual-language (zh/en) landing page for the `aitobox` GitHub organization, hosted on GitHub Pages (`aitobox.github.io`) with custom domain `aitobox.com`, auto-deployed to the `gh-pages` branch via GitHub Actions.

**Architecture:** Astro static site generation (SSG) with native i18n routing (`/` for Chinese, `/en/` for English) and Tailwind CSS. The page is data-driven by a strongly-typed `src/data/projects.ts` configuration, rendered through modular Astro components with zero client-side JavaScript runtime overhead (except for a lightweight anti-FOUC theme toggle script).

**Tech Stack:** Astro v4+, Tailwind CSS v3+, TypeScript, GitHub Actions (`peaceiris/actions-gh-pages@v4`).

**Spec:** `docs/superpowers/specs/2026-09-28-aitobox-landing-page-design.md`

## Global Constraints

- Root custom apex domain: `aitobox.com` configured in `public/CNAME`.
- Target repository: `aitobox/aitobox.github.io`
- Deployment branch: `gh-pages`
- Built-in i18n: Default locale `zh` at `/`, `en` at `/en/`.
- Styling: Tailwind CSS with `darkMode: 'class'`, adaptive light/dark theme.
- Anti-FOUC: Inline script in `<head>` preventing theme flicker on page load.
- Zero client-side JS framework dependencies (no React/Vue runtime, pure static HTML/CSS with vanilla JS snippets for toggles).

---

### Task 1: Project Scaffolding & Tooling Setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `public/CNAME`
- Create: `.gitignore`

**Interfaces:**
- Produces: Astro build environment with Tailwind CSS and native i18n configuration, producing static build in `./dist`.

- [ ] **Step 1: Create `.gitignore`**

```bash
cat << 'EOF' > .gitignore
# Build output
dist/
.astro/

# Dependencies
node_modules/

# Environment
.env
.env.*
!.env.example

# OS / Editor
.DS_Store
Thumbs.db
.vscode/
.idea/
EOF
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "aitobox-landing-page",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "test:data": "node tests/validate-data.mjs"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/tailwind": "^5.1.5",
    "astro": "^4.16.18",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://aitobox.com',
  integrations: [tailwind({ applyBaseStyles: false })],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 4: Create `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 6: Create `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200 antialiased;
  }
}
```

- [ ] **Step 7: Create `public/CNAME`**

```
aitobox.com
```

- [ ] **Step 8: Install dependencies and verify environment**

Run: `npm install`
Expected: Dependencies installed cleanly without audit errors.

- [ ] **Step 9: Commit scaffold**

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tailwind.config.mjs tsconfig.json src/styles/global.css public/CNAME
git commit -m "chore: scaffold Astro project with Tailwind CSS and i18n config"
```

---

### Task 2: Data Schema, Initial Data Matrix & Translation Dictionary

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`
- Create: `tests/validate-data.mjs`

**Interfaces:**
- Produces:
  - `projectsData: { brand: BrandInfo, projects: SoftwareProjectItem[], publications: PublicationItem[], media: MediaItem[], socials: SocialLink[] }`
  - `uiTranslations: Record<'zh' | 'en', Record<string, string>>`
  - `useTranslations(lang: 'zh' | 'en'): (key: string) => string`
  - `getLocalizedProjects(lang: 'zh' | 'en')`

- [ ] **Step 1: Create `src/data/projects.ts`**

```typescript
export interface BrandInfo {
  name: string;
  nameEn: string;
  slogan: string;
  sloganEn: string;
}

export interface BaseItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  url: string;
  github?: string;
  tags: string[];
  badge?: string;
}

export interface SoftwareProjectItem extends BaseItem {
  category: 'projects';
  platform?: string;
}

export interface PublicationItem extends BaseItem {
  category: 'publications';
  frequency: string;
  frequencyEn: string;
  submitUrl?: string;
}

export interface MediaItem extends BaseItem {
  category: 'media';
  type: 'podcast' | 'video';
  platforms: {
    platform: 'xiaoyuzhou' | 'bilibili' | 'youtube';
    label: string;
    url: string;
  }[];
  quote: {
    zh: string;
    en: string;
  };
}

export interface SocialLink {
  platform: 'x' | 'youtube' | 'zhihu' | 'bilibili' | 'github';
  label: string;
  url: string;
}

export const brandInfo: BrandInfo = {
  name: 'AIToBox (艾特智能)',
  nameEn: 'AIToBox',
  slogan: '这里是一个关于在AI时代进行各种创作的探索实验田',
  sloganEn: 'This is an experimental field for exploring various forms of creation in the AI era.',
};

export const softwareProjects: SoftwareProjectItem[] = [
  {
    id: 'atb-cmder',
    name: 'ATBCmder',
    nameEn: 'ATBCmder',
    description: 'MacOS平台的双面板文件管理利器',
    descriptionEn: 'A powerful dual-pane file management tool for macOS',
    url: 'https://cmder.aitobox.com/',
    github: 'https://github.com/aitobox/ATBCmder',
    platform: 'macOS',
    tags: ['macOS', 'File Manager', 'Dual-pane', 'Utility'],
    badge: 'Popular',
  },
  {
    id: 'atb-clone',
    name: 'ATBClone',
    nameEn: 'ATBClone',
    description: 'MacOS平台的APP分身工具',
    descriptionEn: 'An App cloning tool for macOS',
    url: 'https://github.com/aitobox/ATBClone',
    github: 'https://github.com/aitobox/ATBClone',
    platform: 'macOS',
    tags: ['macOS', 'App Clone', 'System', 'Open Source'],
    badge: 'Open Source',
  },
  {
    id: 'atb-novel',
    name: 'ATBNovel',
    nameEn: 'ATBNovel',
    description: '艾特智能写作工厂 - 用AI帮您创作长篇小说',
    descriptionEn: 'AIToBox Writing Factory - Helping you create full-length novels with AI',
    url: 'https://github.com/aitobox/ATBNovel',
    github: 'https://github.com/aitobox/ATBNovel',
    tags: ['AI Writing', 'Novels', 'LLM', 'Creative'],
    badge: 'Active',
  },
  {
    id: 'atb-bard',
    name: 'ATBard',
    nameEn: 'ATBard',
    description: '艾特朗诵家 - AI技术构建的高保真文学朗诵与有声书配音平台',
    descriptionEn: 'AIToBox Reciter - A high-fidelity literary recitation and audiobook dubbing platform built with AI technology',
    url: 'https://github.com/aitobox/ATBard',
    github: 'https://github.com/aitobox/ATBard',
    tags: ['AI Voice', 'TTS', 'Audiobook', 'Media'],
    badge: 'Active',
  },
];

export const publications: PublicationItem[] = [
  {
    id: 'newsweekly',
    name: 'AIToBox周刊',
    nameEn: 'AIToBox Weekly',
    description: '每周AI资讯、工具推荐。记录每周值得分享的AI资讯、好用的工具和服务，周六发布。',
    descriptionEn: 'Documenting AI news, useful tools, and services worth sharing every week. Published on Saturdays.',
    url: 'https://newsweekly.aitobox.com',
    github: 'https://github.com/aitobox/newsweekly',
    frequency: '周六发布',
    frequencyEn: 'Published Saturdays',
    submitUrl: 'https://github.com/aitobox/newsweekly/issues/new/choose',
    tags: ['Weekly', 'AI News', 'Tools', 'Newsletter'],
    badge: 'Weekly',
  },
  {
    id: 'atb-insight',
    name: 'ATBInsight',
    nameEn: 'ATBInsight',
    description: '一个自动爬取网上关于科技AI资讯的机器人，每日自动发布资讯。',
    descriptionEn: 'A bot that automatically crawls the web for tech and AI news, publishing updates daily.',
    url: 'https://insight.aitobox.com/',
    frequency: '每日自动更新',
    frequencyEn: 'Updated Daily',
    tags: ['Bot', 'Daily News', 'Automation', 'Crawler'],
    badge: 'Daily',
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: 'silicon-business-talk',
    name: '硅基商谈 (AI Talk Business)',
    nameEn: 'Silicon-Based Business Talk',
    description: '一档由 AI 驱动的商业深度观察栏目。利用人工智能强大的信息整合与分析能力，提炼关键洞察。',
    descriptionEn: 'An AI-driven in-depth commercial observation program, extracting key insights with pure logic.',
    url: 'https://www.xiaoyuzhoufm.com/podcast/6926a437c536dff439d5c6f6',
    type: 'podcast',
    platforms: [
      {
        platform: 'xiaoyuzhou',
        label: '小宇宙播客',
        url: 'https://www.xiaoyuzhoufm.com/podcast/6926a437c536dff439d5c6f6',
      },
      {
        platform: 'bilibili',
        label: '哔哩哔哩',
        url: 'https://space.bilibili.com/382006998',
      },
    ],
    quote: {
      zh: '「硅基商谈」是一档由 AI 驱动的商业深度观察栏目。在这里，我们不谈鸡汤，只谈逻辑；不追逐热点，只拆解本质。利用人工智能强大的信息整合与分析能力，为您从海量财报、市场数据中提炼关键洞察，用绝对理性的“硅基视角”，讲述那些被忽略的商业故事。',
      en: '"Silicon-Based Business Talk" is an AI-driven in-depth commercial observation program. Here, we skip the motivational fluff and focus purely on logic; we don\'t chase trends, but rather deconstruct the essence.',
    },
    tags: ['Podcast', 'Business Insight', 'AI Analysis', 'Logic-First'],
    badge: 'Podcast',
  },
  {
    id: 'ai-news-tutorials',
    name: 'AI资讯教程',
    nameEn: 'AI News & Tutorials',
    description: '第一时间同步国外最新的AI资讯、技术和工具。',
    descriptionEn: 'Synchronizing the latest global AI news, technologies, and tools at the earliest opportunity.',
    url: 'https://space.bilibili.com/1957706676',
    type: 'video',
    platforms: [
      {
        platform: 'bilibili',
        label: '哔哩哔哩频道',
        url: 'https://space.bilibili.com/1957706676',
      },
    ],
    quote: {
      zh: '第一时间同步国外最新的AI资讯、技术和工具，提供系统化视频解读与实战教程。',
      en: 'Synchronizing the latest global AI news, technologies, and tools with structured video walkthroughs.',
    },
    tags: ['Video', 'Tutorials', 'Latest AI', 'Bilibili'],
    badge: 'Video',
  },
];

export const socialLinks: SocialLink[] = [
  { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/AiTobox' },
  { platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@AiToBox' },
  { platform: 'bilibili', label: 'Bilibili', url: 'https://space.bilibili.com/1957706676' },
  { platform: 'zhihu', label: '知乎', url: 'https://www.zhihu.com/people/aitobox' },
  { platform: 'github', label: 'GitHub', url: 'https://github.com/aitobox' },
];
```

- [ ] **Step 2: Create `src/i18n/ui.ts`**

```typescript
export const languages = {
  zh: '简体中文',
  en: 'English',
};

export const defaultLang = 'zh';

export const ui = {
  zh: {
    'nav.projects': '软件项目',
    'nav.publications': '周刊资讯',
    'nav.media': '播客与视频',
    'nav.github': 'GitHub 组织',
    'nav.toggleTheme': '切换明暗模式',
    'nav.switchLang': 'English',
    'hero.badge': '🚀 探索创作新边界',
    'hero.cta.projects': '浏览项目矩阵',
    'hero.cta.github': '访问 GitHub',
    'section.projects.title': '核心项目 / Projects',
    'section.projects.desc': 'MacOS 效率工具、AI 小说生成与高保真语音朗诵系统',
    'section.publications.title': '资讯与出版 / Publications',
    'section.publications.desc': '每周精选 AI 资讯、实用工具推荐与每日自动化资讯爬虫',
    'section.publications.submit': '欢迎投稿推荐',
    'section.media.title': '播客与视频 / Podcasts & Videos',
    'section.media.desc': '深度商业逻辑观察栏目与一手海外最新 AI 视频教程',
    'card.visit': '访问官网',
    'card.github': '查看源码',
    'card.listen': '立即收听',
    'card.watch': '观看视频',
    'footer.slogan': '这里是一个关于在AI时代进行各种创作的探索实验田。',
    'footer.rights': '保留所有权利。',
    'footer.domain': 'aitobox.com 官方网站',
  },
  en: {
    'nav.projects': 'Projects',
    'nav.publications': 'Publications',
    'nav.media': 'Podcasts & Videos',
    'nav.github': 'GitHub Org',
    'nav.toggleTheme': 'Toggle Theme',
    'nav.switchLang': '简体中文',
    'hero.badge': '🚀 Exploring New Frontiers of Creation',
    'hero.cta.projects': 'Explore Matrix',
    'hero.cta.github': 'Visit GitHub',
    'section.projects.title': 'Core Projects',
    'section.projects.desc': 'macOS productivity tools, AI novel writing factory, and voice dubbing platforms',
    'section.publications.title': 'Publications & News',
    'section.publications.desc': 'Weekly curated AI news, tool recommendations, and daily automated crawler bot',
    'section.publications.submit': 'Submit Recommendation',
    'section.media.title': 'Podcasts & Videos',
    'section.media.desc': 'In-depth commercial observation and latest global AI video tutorials',
    'card.visit': 'Visit Website',
    'card.github': 'Source Code',
    'card.listen': 'Listen Now',
    'card.watch': 'Watch Video',
    'footer.slogan': 'An experimental field for exploring various forms of creation in the AI era.',
    'footer.rights': 'All rights reserved.',
    'footer.domain': 'aitobox.com Official Site',
  },
} as const;
```

- [ ] **Step 3: Create `src/i18n/utils.ts`**

```typescript
import { ui, defaultLang } from './ui';

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocalizedPath(currentPath: string, targetLang: 'zh' | 'en'): string {
  const isEn = currentPath.startsWith('/en');
  if (targetLang === 'en') {
    if (isEn) return currentPath;
    return `/en${currentPath === '/' ? '' : currentPath}`;
  } else {
    if (!isEn) return currentPath;
    const stripped = currentPath.replace(/^\/en/, '');
    return stripped === '' ? '/' : stripped;
  }
}
```

- [ ] **Step 4: Create validation test `tests/validate-data.mjs`**

```javascript
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
```

- [ ] **Step 5: Run data validation**

Run: `node --loader tsx tests/validate-data.mjs || node tests/validate-data.mjs`
Expected: PASS with "✓ All data and i18n validations passed successfully!"

- [ ] **Step 6: Commit Data & i18n Layer**

```bash
git add src/data/projects.ts src/i18n/ui.ts src/i18n/utils.ts tests/validate-data.mjs
git commit -m "feat: implement data schema, initial content matrix, and i18n dictionaries"
```

---

### Task 3: Layout & Base UI Shell (Header, LanguageToggle & ThemeToggle)

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/LanguageToggle.astro`
- Create: `src/components/Navbar.astro`

**Interfaces:**
- Consumes: `src/styles/global.css`, `useTranslations`, `getLocalizedPath`
- Produces: Base HTML layout with anti-FOUC script, SEO meta tags, reactive theme switcher, language switcher, and responsive navbar.

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
---
interface Props {
  ariaLabel?: string;
}
const { ariaLabel = '切换明暗主题' } = Astro.props;
---

<button
  id="theme-toggle"
  type="button"
  class="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
  aria-label={ariaLabel}
>
  <!-- Sun Icon (shown in dark mode) -->
  <svg id="theme-toggle-sun" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <!-- Moon Icon (shown in light mode) -->
  <svg id="theme-toggle-moon" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
</button>

<script is:inline>
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
</script>
```

- [ ] **Step 2: Create `src/components/LanguageToggle.astro`**

```astro
---
import { getLocalizedPath } from '../i18n/utils';

interface Props {
  currentLang: 'zh' | 'en';
}

const { currentLang } = Astro.props;
const currentPath = Astro.url.pathname;
const targetLang = currentLang === 'zh' ? 'en' : 'zh';
const targetPath = getLocalizedPath(currentPath, targetLang);
const targetLabel = currentLang === 'zh' ? 'EN' : '中';
---

<a
  href={targetPath}
  class="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
  title={currentLang === 'zh' ? 'Switch to English' : '切换到简体中文'}
>
  {targetLabel}
</a>
```

- [ ] **Step 3: Create `src/components/Navbar.astro`**

```astro
---
import { useTranslations } from '../i18n/utils';
import ThemeToggle from './ThemeToggle.astro';
import LanguageToggle from './LanguageToggle.astro';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const prefix = lang === 'en' ? '/en' : '';
---

<header class="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- Brand -->
    <a href={prefix || '/'} class="flex items-center gap-3 group">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
        A
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-slate-900 dark:text-white leading-tight">AIToBox</span>
        <span class="text-[10px] text-slate-500 dark:text-zinc-400 font-mono tracking-wider">aitobox.com</span>
      </div>
    </a>

    <!-- Nav Links -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-zinc-300">
      <a href="#projects" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('nav.projects')}</a>
      <a href="#publications" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('nav.publications')}</a>
      <a href="#media" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('nav.media')}</a>
    </nav>

    <!-- Actions (Social, Lang, Theme) -->
    <div class="flex items-center gap-3">
      <a
        href="https://github.com/aitobox"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        <span>GitHub</span>
      </a>

      <LanguageToggle currentLang={lang} />
      <ThemeToggle ariaLabel={t('nav.toggleTheme')} />
    </div>
  </div>
</header>
```

- [ ] **Step 4: Create `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  lang: 'zh' | 'en';
}

const { title, description, lang } = Astro.props;
const siteUrl = 'https://aitobox.com';
const canonicalURL = new URL(Astro.url.pathname, siteUrl);
const zhURL = new URL('/', siteUrl);
const enURL = new URL('/en/', siteUrl);
---

<!doctype html>
<html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- i18n Alternates -->
    <link rel="alternate" hreflang="zh-CN" href={zhURL} />
    <link rel="alternate" hreflang="en" href={enURL} />
    <link rel="alternate" hreflang="x-default" href={zhURL} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@AiTobox" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <!-- Anti-FOUC Theme Script -->
    <script is:inline>
      const theme = (() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        return 'light';
      })();

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      window.localStorage.setItem('theme', theme);
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 5: Create a placeholder `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="24" fill="#6366f1"/>
  <text x="50" y="66" font-size="48" font-family="-apple-system, system-ui, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">A</text>
</svg>
```

- [ ] **Step 6: Commit Base UI Shell**

```bash
git add src/layouts/Layout.astro src/components/ThemeToggle.astro src/components/LanguageToggle.astro src/components/Navbar.astro public/favicon.svg
git commit -m "feat: implement base HTML layout with anti-FOUC, theme toggle, and navbar"
```

---

### Task 4: Content Presentation Components (Hero, Cards, Social & Footer)

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SectionHeader.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/PublicationCard.astro`
- Create: `src/components/MediaCard.astro`
- Create: `src/components/SocialLinks.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `src/data/projects.ts`, `src/i18n/utils.ts`
- Produces: Polished interactive showcase cards and sections adapting smoothly to both Light and Dark themes.

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { brandInfo } from '../data/projects';
import { useTranslations } from '../i18n/utils';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const slogan = lang === 'en' ? brandInfo.sloganEn : brandInfo.slogan;
---

<section class="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
  <!-- Subtle Glow Effect -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <!-- Tag Pill -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 mb-6 shadow-sm">
      <span>{t('hero.badge')}</span>
    </div>

    <!-- Title -->
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
      AIToBox <span class="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">{lang === 'zh' ? '艾特智能' : 'Studio'}</span>
    </h1>

    <!-- Slogan -->
    <p class="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-zinc-300 leading-relaxed mb-10">
      {slogan}
    </p>

    <!-- CTAs -->
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a
        href="#projects"
        class="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25 transition-all"
      >
        {t('hero.cta.projects')}
      </a>
      <a
        href="https://github.com/aitobox"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all shadow-sm"
      >
        {t('hero.cta.github')}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/SectionHeader.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  id?: string;
}

const { title, description, id } = Astro.props;
---

<div id={id} class="scroll-mt-24 mb-10">
  <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
    {title}
  </h2>
  {description && (
    <p class="mt-2 text-sm sm:text-base text-slate-500 dark:text-zinc-400">
      {description}
    </p>
  )}
</div>
```

- [ ] **Step 3: Create `src/components/ProjectCard.astro`**

```astro
---
import type { SoftwareProjectItem } from '../data/projects';
import { useTranslations } from '../i18n/utils';

interface Props {
  project: SoftwareProjectItem;
  lang: 'zh' | 'en';
}

const { project, lang } = Astro.props;
const t = useTranslations(lang);
const name = lang === 'en' && project.nameEn ? project.nameEn : project.name;
const description = lang === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
---

<div class="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <div>
    <!-- Card Top: Badge & Platform -->
    <div class="flex items-center justify-between gap-2 mb-4">
      {project.badge && (
        <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
          {project.badge}
        </span>
      )}
      {project.platform && (
        <span class="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
          {project.platform}
        </span>
      )}
    </div>

    <!-- Title & Desc -->
    <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
      <a href={project.url} target="_blank" rel="noopener noreferrer" class="focus:outline-none">
        {name}
      </a>
    </h3>
    <p class="mt-2.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>

    <!-- Tags -->
    <div class="mt-4 flex flex-wrap gap-1.5">
      {project.tags.map(tag => (
        <span class="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
          #{tag}
        </span>
      ))}
    </div>
  </div>

  <!-- Links Footer -->
  <div class="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-medium">
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
    >
      <span>{t('card.visit')}</span>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    </a>

    {project.github && project.github !== project.url && (
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        class="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1"
      >
        <span>{t('card.github')}</span>
      </a>
    )}
  </div>
</div>
```

- [ ] **Step 4: Create `src/components/PublicationCard.astro`**

```astro
---
import type { PublicationItem } from '../data/projects';
import { useTranslations } from '../i18n/utils';

interface Props {
  item: PublicationItem;
  lang: 'zh' | 'en';
}

const { item, lang } = Astro.props;
const t = useTranslations(lang);
const name = lang === 'en' && item.nameEn ? item.nameEn : item.name;
const description = lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
const frequency = lang === 'en' ? item.frequencyEn : item.frequency;
---

<div class="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 hover:border-cyan-500/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <div>
    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50">
        {frequency}
      </span>
      <span class="text-xs text-slate-400 dark:text-zinc-500 font-mono">
        {item.url.replace('https://', '')}
      </span>
    </div>

    <h3 class="text-xl font-bold text-slate-900 dark:text-white">
      <a href={item.url} target="_blank" rel="noopener noreferrer" class="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
        {name}
      </a>
    </h3>

    <p class="mt-2.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>

    <div class="mt-4 flex flex-wrap gap-1.5">
      {item.tags.map(tag => (
        <span class="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
          #{tag}
        </span>
      ))}
    </div>
  </div>

  <div class="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-medium">
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
    >
      <span>{t('card.visit')}</span>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    </a>

    {item.submitUrl && (
      <a
        href={item.submitUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
      >
        {t('section.publications.submit')} →
      </a>
    )}
  </div>
</div>
```

- [ ] **Step 5: Create `src/components/MediaCard.astro`**

```astro
---
import type { MediaItem } from '../data/projects';
import { useTranslations } from '../i18n/utils';

interface Props {
  item: MediaItem;
  lang: 'zh' | 'en';
}

const { item, lang } = Astro.props;
const t = useTranslations(lang);
const name = lang === 'en' && item.nameEn ? item.nameEn : item.name;
const quote = lang === 'en' ? item.quote.en : item.quote.zh;
---

<div class="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <div class="flex items-center justify-between mb-4">
    <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
      {item.badge}
    </span>
    <div class="flex gap-2">
      {item.platforms.map(p => (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
        >
          {p.label} ↗
        </a>
      ))}
    </div>
  </div>

  <h3 class="text-xl font-bold text-slate-900 dark:text-white">
    {name}
  </h3>

  <!-- Quote block -->
  <blockquote class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border-l-4 border-indigo-500 text-sm text-slate-700 dark:text-zinc-300 italic leading-relaxed">
    {quote}
  </blockquote>

  <div class="mt-4 flex flex-wrap gap-1.5">
    {item.tags.map(tag => (
      <span class="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
        #{tag}
      </span>
    ))}
  </div>
</div>
```

- [ ] **Step 6: Create `src/components/SocialLinks.astro`**

```astro
---
import { socialLinks } from '../data/projects';
---

<div class="flex flex-wrap items-center gap-3">
  {socialLinks.map(s => (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-zinc-700"
    >
      {s.label} ↗
    </a>
  ))}
</div>
```

- [ ] **Step 7: Create `src/components/Footer.astro`**

```astro
---
import { brandInfo } from '../data/projects';
import { useTranslations } from '../i18n/utils';
import SocialLinks from './SocialLinks.astro';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const currentYear = new Date().getFullYear();
---

<footer class="mt-20 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-100/50 dark:bg-zinc-950 transition-colors">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span class="font-bold text-slate-900 dark:text-white">AIToBox</span>
          <span class="text-xs text-slate-400 dark:text-zinc-500">({brandInfo.name})</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-zinc-400 max-w-md">
          {t('footer.slogan')}
        </p>
      </div>

      <!-- Social Channels -->
      <SocialLinks />
    </div>

    <div class="mt-8 pt-8 border-t border-slate-200/80 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
      <p>© {currentYear} AIToBox. {t('footer.rights')}</p>
      <p class="font-mono">{t('footer.domain')}</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 8: Commit Content Components**

```bash
git add src/components/Hero.astro src/components/SectionHeader.astro src/components/ProjectCard.astro src/components/PublicationCard.astro src/components/MediaCard.astro src/components/SocialLinks.astro src/components/Footer.astro
git commit -m "feat: implement hero, card widgets, social links, and footer components"
```

---

### Task 5: Page Assembly, Robots.txt & Dual-Language Routing

**Files:**
- Create: `src/components/MainPage.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`
- Create: `public/robots.txt`

**Interfaces:**
- Consumes: All UI components and data layers.
- Produces: Complete, bilingual static HTML production build under `dist/` with zero TypeScript lint errors.

- [ ] **Step 1: Create `src/components/MainPage.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from './Navbar.astro';
import Hero from './Hero.astro';
import SectionHeader from './SectionHeader.astro';
import ProjectCard from './ProjectCard.astro';
import PublicationCard from './PublicationCard.astro';
import MediaCard from './MediaCard.astro';
import Footer from './Footer.astro';
import { brandInfo, softwareProjects, publications, mediaItems } from '../data/projects';
import { useTranslations } from '../i18n/utils';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const t = useTranslations(lang);
const pageTitle = `${brandInfo.name} - ${lang === 'en' ? brandInfo.sloganEn : brandInfo.slogan}`;
const pageDesc = lang === 'en' ? brandInfo.sloganEn : brandInfo.slogan;
---

<Layout title={pageTitle} description={pageDesc} lang={lang}>
  <Navbar lang={lang} />

  <main>
    <Hero lang={lang} />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-8">
      <!-- 1. Software Projects -->
      <section>
        <SectionHeader
          id="projects"
          title={t('section.projects.title')}
          description={t('section.projects.desc')}
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {softwareProjects.map(project => (
            <ProjectCard project={project} lang={lang} />
          ))}
        </div>
      </section>

      <!-- 2. Publications -->
      <section>
        <SectionHeader
          id="publications"
          title={t('section.publications.title')}
          description={t('section.publications.desc')}
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map(item => (
            <PublicationCard item={item} lang={lang} />
          ))}
        </div>
      </section>

      <!-- 3. Podcasts & Videos -->
      <section>
        <SectionHeader
          id="media"
          title={t('section.media.title')}
          description={t('section.media.desc')}
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaItems.map(item => (
            <MediaCard item={item} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  </main>

  <Footer lang={lang} />
</Layout>
```

- [ ] **Step 2: Create `src/pages/index.astro` (Chinese / Default)**

```astro
---
import MainPage from '../components/MainPage.astro';
---

<MainPage lang="zh" />
```

- [ ] **Step 3: Create `src/pages/en/index.astro` (English)**

```astro
---
import MainPage from '../components/MainPage.astro';
---

<MainPage lang="en" />
```

- [ ] **Step 4: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://aitobox.com/sitemap.xml
```

- [ ] **Step 5: Run Astro TypeScript typecheck**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Run Astro static build**

Run: `npm run build`
Expected: Successful build into `./dist`:
- `dist/index.html` (Chinese page)
- `dist/en/index.html` (English page)
- `dist/CNAME` (Containing `aitobox.com`)
- `dist/robots.txt`

- [ ] **Step 7: Commit Page Assembly**

```bash
git add src/components/MainPage.astro src/pages/index.astro src/pages/en/index.astro public/robots.txt
git commit -m "feat: complete page assembly and dual-language routing (zh/en)"
```

---

### Task 6: GitHub Actions Workflow for Automated Deployment to `gh-pages`

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: GitHub Actions CI/CD configuration that triggers on pushes to `main` branch, installs dependencies, builds static site, and pushes build artifacts + CNAME directly to the `gh-pages` branch.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Build and Deploy to gh-pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci || npm install

      - name: Build Astro site
        run: npm run build

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: aitobox.com
```

- [ ] **Step 2: Commit Deployment Workflow**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow to auto-deploy to gh-pages branch"
```

---

### Task 7: Full End-to-End Verification & Sanity Checks

**Files:**
- Test all built assets and features

- [ ] **Step 1: Run comprehensive build verification**

Run: `npm run build`
Expected: Successful build with exit code 0.

- [ ] **Step 2: Verify `dist/CNAME` content**

Run: `cat dist/CNAME`
Expected: `aitobox.com`

- [ ] **Step 3: Verify HTML generation and alternate hreflang tags**

Run: `grep -q 'hreflang="zh-CN"' dist/index.html && grep -q 'hreflang="en"' dist/index.html && grep -q 'ATBCmder' dist/index.html && grep -q 'ATBCmder' dist/en/index.html && echo "HTML verified!"`
Expected: `HTML verified!`

- [ ] **Step 4: Check git status is clean**

Run: `git status`
Expected: Working tree clean, everything committed.
