'use client';

import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SITE_NAME = '唯客 AI 护栏';
const BASE_URL = 'https://sec.jotoai.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // 更新 title
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // 辅助函数：更新或创建 meta 标签
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attrName, attrValue.replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // 辅助函数：更新或创建 link 标签
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    const imageUrl = ogImage || DEFAULT_OG_IMAGE;

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }

    if (keywords) {
      setMeta('meta[name="keywords"]', 'content', keywords);
    }

    // robots
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:image"]', 'content', imageUrl);

    // Twitter Card
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:image"]', 'content', imageUrl);

    // 结构化数据
    const existingScript = document.querySelector('script[data-seo-dynamic]');
    if (existingScript) existingScript.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // 清理函数：页面卸载时恢复默认
    return () => {
      const dynamicScript = document.querySelector('script[data-seo-dynamic]');
      if (dynamicScript) dynamicScript.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredData]);
}
