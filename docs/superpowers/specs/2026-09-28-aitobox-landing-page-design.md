# AIToBox 组织官方落地页 (Landing Page) 架构与设计规范

- **状态**: Approved (Brainstorming 完成)
- **日期**: 2026-09-28
- **目标仓库**: `aitobox/aitobox.github.io`
- **托管平台**: GitHub Pages
- **自定义主域名**: `aitobox.com` (及 `www.aitobox.com`)
- **技术栈**: Astro + Tailwind CSS + TypeScript

---

## 1. 概述与设计定位

AIToBox（艾特智能）是一个聚焦在 AI 时代进行多元创作的探索实验田。
本项目的核心目标是打造一个现代化、高质感、极速响应、维护直观的**单页产品与内容矩阵官网 (One-page Landing Page)**，作为 `aitobox` GitHub 组织的对外门面，集中呈现旗下的软件工具、AI 实验、周刊出版物、商业播客及音视频教程。

---

## 2. 仓库架构与域名规划

### 2.1 仓库架构隔离
遵循 GitHub 官方规范，不将落地页代码混入管理组织全局元数据的 `.github` 仓库，而是采用独立专用的 `aitobox.github.io` 仓库：
- **组织级 `.github` 仓库**：保留原用途，仅用于 Org Profile (`profile/README.md`)、全局 Issue/PR 模板与社区治理文件。
- **官网专用仓库 `aitobox.github.io`**：独立维护 Landing Page 源码、前端构建配置、CI/CD 部署流以及 CNAME 域名配置。

### 2.2 域名与 DNS 解析策略
- **顶级域名**: `aitobox.com`
- **子域名矩阵对应**:
  - 官网主站: `https://aitobox.com` (以及 `https://www.aitobox.com`)
  - AIToBox 周刊: `https://newsweekly.aitobox.com`
  - ATBInsight 资讯机器人: `https://insight.aitobox.com`
  - ATBCmder 终端管理: `https://cmder.aitobox.com`
- **GitHub Pages 配置**:
  - 部署来源 (Build and deployment source): **Deploy from a branch**
  - 分支 (Branch): **`gh-pages`** / 根目录 **`/ (root)`**
- **项目内配置**:
  - `public/CNAME` 包含单行内容：`aitobox.com`
- **DNS 解析**:
  - `aitobox.com` 配置 A 记录指向 GitHub Pages 官方 Anycast IP（`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`）。
  - `www.aitobox.com` 配置 CNAME 指向 `aitobox.github.io`。

---

## 3. 技术栈与架构原则

### 3.1 核心技术栈
- **SSG 框架**: Astro (v4+) - 纯静态渲染（0 客户端 JS 运行时开销，首屏瞬间触达）
- **国际化引擎 (i18n)**: Astro 内置原生 i18n 路由 (`defaultLocale: 'zh'`, `locales: ['zh', 'en']`)
- **样式方案**: Tailwind CSS - 实用类优先，兼顾轻量与高度定制性
- **开发语言**: TypeScript - 数据结构强类型约束
- **部署环境**: GitHub Actions + GitHub Pages 原生 Deployment Artifacts

### 3.2 架构原则
- **数据驱动 (Data-Driven)**: 页面所有展示内容（项目、媒体、周刊、外部链接）全部通过声明式数据文件驱动，未来修改或新增项目仅需编辑单一数据文件，无需修改组件或页面结构。
- **全站原生双语 (First-class i18n)**: 默认中文路径 `/`，英文路径 `/en/`；UI 字典与数据字段彻底解耦，提供无缝语言切换与标准 `hreflang` SEO 标签。
- **明暗自适应 (Theme Adaptive)**: 默认支持跟随操作系统偏好，提供无缝的主动切换按钮，内联首屏防闪烁（Anti-FOUC）脚本。
- **零冗余 (YAGNI & Zero Slop)**: 剔除不必要的重型运行时与框架依赖，专注纯粹的内容呈现与极致的加载速度。

---

## 4. 数据结构与初始内容矩阵

数据源位于 `src/data/projects.ts`。

### 4.1 数据 Schema 定义
```typescript
export interface BaseItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  url: string;
  github?: string;
  category: 'projects' | 'publications' | 'media';
  tags: string[];
  badge?: string;
  featured?: boolean;
}

export interface MediaItem extends BaseItem {
  category: 'media';
  type: 'podcast' | 'video';
  platforms: {
    platform: 'xiaoyuzhou' | 'bilibili' | 'youtube';
    label: string;
    url: string;
  }[];
  quote?: {
    zh: string;
    en: string;
  };
}

export interface PublicationItem extends BaseItem {
  category: 'publications';
  frequency?: string;
  submitUrl?: string;
}

export interface SoftwareProjectItem extends BaseItem {
  category: 'projects';
  platform?: 'macOS' | 'Cross-platform' | 'Web';
}

export interface SocialLink {
  platform: 'x' | 'youtube' | 'zhihu' | 'bilibili' | 'github';
  label: string;
  url: string;
}
```

### 4.2 初始内容矩阵梳理

1. **组织品牌 (Brand Info)**:
   - **名称**: AIToBox (艾特智能)
   - **标语 (Slogan)**:
     - 中文: 这里是一个关于在 AI 时代进行各种创作的探索实验田。
     - 英文: *This is an experimental field for exploring various forms of creation in the AI era.*

2. **探索矩阵 - 核心软件项目 (Software Projects)**:
   - **ATBCmder**:
     - 描述: MacOS 平台的双面板文件管理利器 / *A powerful dual-pane file management tool for macOS*
     - 官网: `https://cmder.aitobox.com/`
     - 平台: `macOS`
     - 标签: `['macOS', 'File Manager', 'Dual-pane', 'Utility']`
   - **ATBClone**:
     - 描述: MacOS 平台的 APP 分身工具 / *An App cloning tool for macOS*
     - 源码: `https://github.com/aitobox/ATBClone`
     - 平台: `macOS`
     - 标签: `['macOS', 'App Clone', 'System', 'Open Source']`
   - **ATBNovel**:
     - 描述: 艾特智能写作工厂 - 用 AI 帮您创作长篇小说 / *AIToBox Writing Factory - Helping you create full-length novels with AI*
     - 源码: `https://github.com/aitobox/ATBNovel`
     - 标签: `['AI', 'Novel Writing', 'Creation', 'LLM']`
     - 状态角标: `Active`
   - **ATBard**:
     - 描述: 艾特朗诵家 - AI 技术构建的高保真文学朗诵与有声书配音平台 / *AIToBox Reciter - A high-fidelity literary recitation and audiobook dubbing platform built with AI technology*
     - 源码: `https://github.com/aitobox/ATBard`
     - 标签: `['AI Voice', 'TTS', 'Audiobook', 'Media']`
     - 状态角标: `Active`

3. **探索矩阵 - 资讯与出版 (Publications)**:
   - **AIToBox 周刊 (AIToBox Weekly)**:
     - 描述: 每周 AI 资讯、工具推荐。记录每周值得分享的 AI 资讯、好用的工具和服务，周六发布。
     - 官网: `https://newsweekly.aitobox.com`
     - 投稿通道: `https://github.com/aitobox/newsweekly/issues/new/choose`
     - 标签: `['Weekly', 'AI News', 'Tools', 'Newsletter']`
   - **ATBInsight**:
     - 描述: 一个自动爬取网上关于科技 AI 资讯的机器人，每日自动发布资讯。
     - 官网: `https://insight.aitobox.com/`
     - 标签: `['Bot', 'Daily News', 'Crawler', 'Automation']`

4. **探索矩阵 - 播客与音视频 (Podcasts & Videos)**:
   - **硅基商谈 (AI Talk Business)**:
     - 载体: 深度商业观察播客 / 视频
     - 平台外链:
       - 小宇宙: `https://www.xiaoyuzhoufm.com/podcast/6926a437c536dff439d5c6f6`
       - B 站: `https://space.bilibili.com/382006998`
     - 核心定位 Quote: 
       > 「硅基商谈」是一档由 AI 驱动的商业深度观察栏目。在这里，我们不谈鸡汤，只谈逻辑；不追逐热点，只拆解本质。利用人工智能强大的信息整合与分析能力，为您从海量财报、市场数据中提炼关键洞察，用绝对理性的“硅基视角”，讲述那些被忽略的商业故事。
   - **AI资讯教程 (AI News & Tutorials)**:
     - 载体: 视频频道
     - 平台外链:
       - B 站: `https://space.bilibili.com/1957706676`
     - 核心定位 Quote:
       > 第一时间同步国外最新的 AI 资讯、技术和工具。


5. **官方社交账号与社区 (Social & Community)**:
   - **X (Twitter)**: `https://x.com/AiTobox`
   - **YouTube**: `https://www.youtube.com/@AiToBox`
   - **知乎 (Zhihu)**: `https://www.zhihu.com/people/aitobox`
   - **Bilibili (B站)**: `https://space.bilibili.com/1957706676`
   - **GitHub**: `https://github.com/aitobox`

---

## 5. 组件分层设计与页面结构

```
src/
├── components/
│   ├── Navbar.astro           # 顶部品牌导航、社交外链、语言切换、明暗切换入口
│   ├── ThemeToggle.astro      # 明暗自适应切换按钮
│   ├── LanguageToggle.astro   # 中英语言切换按钮 (ZH / EN)
│   ├── Hero.astro             # 品牌介绍与核心愿景展示 (根据语言渲染)
│   ├── SectionHeader.astro    # 通用模块标题组件
│   ├── ProjectCard.astro      # 软件工具卡片（悬停微交互、平台徽章、外链）
│   ├── PublicationCard.astro  # 资讯/周刊卡片（支持投稿 Issue 快捷入口）
│   ├── MediaCard.astro        # 播客与音视频卡片（多平台徽章与金句展示）
│   ├── SocialLinks.astro      # 社交媒体图标与链接组件（支持高亮悬停效果）
│   ├── MainPage.astro         # 页面主体布局与数据组装容器 (接收 lang 参数，保持 100% DRY)
│   └── Footer.astro           # 版权信息、完整社交矩阵、aitobox.com 域名规范标识
├── data/
│   └── projects.ts            # 全量项目与内容强类型双语数据文件
├── i18n/
│   ├── ui.ts                  # UI 静态多语言字典 (导航、按钮、模块标题、标签)
│   └── utils.ts               # 多语言辅助函数 (useTranslations, getLocalizedPath)
├── layouts/
│   └── Layout.astro           # 统一 HTML 骨架、防闪烁 Script、SEO OpenGraph 与 hreflang
└── pages/
    ├── index.astro            # 默认中文落地页 (/)
    └── en/
        └── index.astro        # 英文落地页 (/en/)
```

### 5.1 页面排版顺序
1. **Header / Navbar**: 品牌标识 + 快速跳转锚点 + 核心社交外链 (GitHub, X) + Language Toggle (ZH/EN) + Theme Toggle
2. **Hero Section**: 品牌名称 + 核心实验田双语理念 + 快速定位 CTA
3. **Section 1: 软件与工具探索 (Projects)**: 4 个核心工具卡片网格
4. **Section 2: 资讯与知识库 (Publications)**: 周刊 + Insight 爬虫机器人
5. **Section 3: 播客与视频视界 (Podcasts & Videos)**: 硅基商谈 + AI资讯教程（突出深度理性视角）
6. **Footer**: 完整社交矩阵 (X, YouTube, 知乎, B站, GitHub)、域名声明 `aitobox.com`、开源协议、版权信息与社区投稿直达

### 5.2 国际化 (i18n) 架构与路由实现
1. **Astro 官方原生路由机制**:
   ```javascript
   // astro.config.mjs
   export default defineConfig({
     i18n: {
       defaultLocale: 'zh',
       locales: ['zh', 'en'],
       routing: {
         prefixDefaultLocale: false, // 默认中文在根路径 /，英文在 /en/
       },
     },
   });
   ```
2. **零重复代码 (DRY) 设计**:
   - `src/components/MainPage.astro` 承载完整的页面结构、动画与网格组合，接收 `{ lang: 'zh' | 'en' }`。
   - `src/pages/index.astro` 仅渲染 `<MainPage lang="zh" />`。
   - `src/pages/en/index.astro` 仅渲染 `<MainPage lang="en" />`。
3. **双语内容与词典分离**:
   - 界面通用文案（导航、筛选标签、CTA 文本、Footer 说明）由 `src/i18n/ui.ts` 集中管理。
   - 项目动态内容（标题、描述、Quote）在 `src/data/projects.ts` 中以字段形式对照存储，通过 `getLocalizedProjects(lang)` 极速按需渲染。
4. **SEO 与搜索引擎规范**:
   - 在 `Layout.astro` 的 `<head>` 中根据当前路径自动注入双向链接：
     - `<link rel="alternate" hreflang="zh" href="https://aitobox.com/" />`
     - `<link rel="alternate" hreflang="en" href="https://aitobox.com/en/" />`
     - `<link rel="alternate" hreflang="x-default" href="https://aitobox.com/" />`
   - 动态同步 `<html lang="zh-CN">` 或 `<html lang="en">`，优化全球搜索引擎索引与无障碍屏幕阅读器体验。

---

## 6. 视觉设计系统规范

- **设计风格**: 明暗自适应现代极简风（Clean & High-craft Aesthetic）
- **调色盘设计**:
  - **浅色模式 (Light)**:
    - 背景: `bg-slate-50`
    - 卡片表面: `bg-white` 配合 `border border-slate-200/80`
    - 主文字: `text-slate-900`
    - 次级文字: `text-slate-600`
  - **深色模式 (Dark)**:
    - 背景: `bg-zinc-950`
    - 卡片表面: `bg-zinc-900/70 backdrop-blur-md` 配合 `border border-zinc-800`
    - 主文字: `text-zinc-100`
    - 次级文字: `text-zinc-400`
  - **品牌点缀色**:
    - 主重点色: Indigo-500 / Cyan-500
    - 渐变效果: Hero 标题文字与 Hover 边框微光
- **微交互与无障碍**:
  - 卡片浮动动效: `transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`
  - 适配完整键盘 Tab 键焦点（`focus-visible:ring-2 focus-visible:ring-indigo-500`）
  - 响应式断点: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` 自适应布局

---

## 7. 部署与 CI/CD 规范

通过 GitHub Actions 在推送到 `main` 分支时自动完成编译，并将产物发布到 **`gh-pages` 分支**。

创建 `.github/workflows/deploy.yml`：
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

---

## 8. 验收与质量验证规范 (Verification)

在完成代码构建与交付时，必须执行以下验证：
1. **类型校验**: 运行 `npm run astro check`，确保 TypeScript 0 错误。
2. **静态构建验证**: 运行 `npm run build`，确保静态 HTML 生成至 `dist/` 目录，无破损链接和未定义变量。
3. **CNAME 校验**: 确保 `dist/CNAME` 存在且包含 `aitobox.com`。
4. **明暗主题与无脚本降级**:
   - 切换系统暗黑模式测试自适应。
   - 手动点击 ThemeToggle 测试 localStorage 存储与即时响应。
   - 检查首屏刷新无白屏闪烁。
5. **视口适配**: 测试 375px（移动端）、768px（平板）、1280px+（桌面端）无水平滚动与排版错位。
