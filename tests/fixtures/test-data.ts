export const SITES = {
  audit:   { name: '唯客智审',     url: 'https://audit.jotoai.com',   pages: ['/', '/blog', '/contact', '/features', '/architecture', '/privacy'] },
  shanyue: { name: '闪阅',         url: 'https://shanyue.jotoai.com', pages: ['/', '/articles', '/capabilities', '/architecture', '/contact', '/privacy'] },
  sec:     { name: '唯客AI护栏',   url: 'https://sec.jotoai.com',     pages: ['/', '/features', '/articles', '/pricing', '/about', '/contact', '/changelog', '/roadmap'] },
  kb:      { name: '唯客知识中台', url: 'https://kb.jotoai.com',      pages: ['/', '/blog'] },
  fasium:  { name: 'FasiumAI',     url: 'https://fasium.jotoai.com',  pages: ['/', '/blog', '/contact', '/privacy'] },
  loop:    { name: 'Loop',          url: 'https://loop.jotoai.com',    pages: ['/'] },
} as const;

export const ADMIN = {
  url: 'https://admin.jotoai.com',
  email: 'tomi@jototech.cn',
  password: '!QAZxsw2',
};

export const CONTACT_SITES = ['audit', 'sec', 'kb', 'fasium'] as const;

export const BLOG_SITES = {
  audit:   { path: '/blog', detailPrefix: '/blog/' },
  shanyue: { path: '/articles', detailPrefix: '/articles/' },
  sec:     { path: '/articles', detailPrefix: '/articles/' },
  kb:      { path: '/blog', detailPrefix: '/blog/' },
  fasium:  { path: '/blog', detailPrefix: '/blog/' },
} as const;

export const BLOCKED_PATTERNS = [
  'googleapis.com', 'gstatic.com', 'google-analytics', 'googletagmanager',
  'gtag/js', 'recaptcha', 'facebook.net', 'connect.facebook', 'twitter.com/widgets',
  'doubleclick.net', 'googlesyndication',
];
