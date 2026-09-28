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
  category?: 'projects';
  platform?: string;
}

export interface PublicationItem extends BaseItem {
  category?: 'publications';
  frequency: string;
  frequencyEn: string;
  submitUrl?: string;
}

export interface MediaItem extends BaseItem {
  category?: 'media';
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
  slogan: 'AI新发现-从这里起航',
  sloganEn: 'Discover AI Frontiers — Embark from Here.',
};

export const softwareProjects: SoftwareProjectItem[] = [
  {
    id: 'atb-cmder',
    name: 'ATBCmder',
    nameEn: 'ATBCmder',
    description: 'MacOS平台的双面板文件管理利器',
    descriptionEn: 'A powerful dual-pane file management tool for macOS',
    url: 'https://cmder.aitobox.com/',
    platform: 'macOS',
    tags: ['macOS', 'File Manager', 'Dual-pane', 'Commercial'],
    badge: 'Commercial',
    category: 'projects',
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
    category: 'projects',
  },
  {
    id: 'atb-novel',
    name: 'ATBNovel',
    nameEn: 'ATBNovel',
    description: '艾特智能写作工厂 - 用AI帮您创作长篇小说',
    descriptionEn: 'AIToBox Writing Factory - Helping you create full-length novels with AI',
    url: 'https://github.com/aitobox/ATBNovel',
    github: 'https://github.com/aitobox/ATBNovel',
    tags: ['AI Writing', 'Novels', 'LLM', 'Open Source'],
    badge: 'Open Source',
    category: 'projects',
  },
  {
    id: 'atb-bard',
    name: 'ATBard',
    nameEn: 'ATBard',
    description: '艾特朗诵家 - AI技术构建的高保真文学朗诵与有声书配音平台',
    descriptionEn: 'AIToBox Reciter - A high-fidelity literary recitation and audiobook dubbing platform built with AI technology',
    url: 'https://github.com/aitobox/ATBard',
    github: 'https://github.com/aitobox/ATBard',
    tags: ['AI Voice', 'TTS', 'Audiobook', 'Open Source'],
    badge: 'Open Source',
    category: 'projects',
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
    category: 'publications',
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
    category: 'publications',
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
    category: 'media',
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
    category: 'media',
  },
];

export const socialLinks: SocialLink[] = [
  { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/AiTobox' },
  { platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@AiToBox' },
  { platform: 'bilibili', label: 'Bilibili', url: 'https://space.bilibili.com/1957706676' },
  { platform: 'zhihu', label: '知乎', url: 'https://www.zhihu.com/people/aitobox' },
  { platform: 'github', label: 'GitHub', url: 'https://github.com/aitobox' },
];

export const projectsData = {
  brand: brandInfo,
  projects: softwareProjects,
  publications,
  media: mediaItems,
  socials: socialLinks,
};

export function getLocalizedProjects(lang: 'zh' | 'en') {
  return {
    brand: {
      name: lang === 'en' ? brandInfo.nameEn : brandInfo.name,
      slogan: lang === 'en' ? brandInfo.sloganEn : brandInfo.slogan,
    },
    projects: softwareProjects.map(p => ({
      ...p,
      name: lang === 'en' && p.nameEn ? p.nameEn : p.name,
      description: lang === 'en' && p.descriptionEn ? p.descriptionEn : p.description,
    })),
    publications: publications.map(p => ({
      ...p,
      name: lang === 'en' && p.nameEn ? p.nameEn : p.name,
      description: lang === 'en' && p.descriptionEn ? p.descriptionEn : p.description,
      frequency: lang === 'en' ? p.frequencyEn : p.frequency,
    })),
    media: mediaItems.map(m => ({
      ...m,
      name: lang === 'en' && m.nameEn ? m.nameEn : m.name,
      description: lang === 'en' && m.descriptionEn ? m.descriptionEn : m.description,
      quoteText: lang === 'en' ? m.quote.en : m.quote.zh,
    })),
    socials: socialLinks,
  };
}
