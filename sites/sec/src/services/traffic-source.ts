import { TrafficSource } from '@/types/traffic-source';

const SESSION_STORAGE_KEY = 'traffic_source';

/** 已知搜索引擎域名 → 来源名称映射 */
const SEARCH_ENGINE_MAP: Record<string, string> = {
  'baidu.com': 'baidu',
  'google.com': 'google',
  'google.co': 'google',
  'bing.com': 'bing',
  'sogou.com': 'sogou',
  'so.com': '360',
  'sm.cn': 'shenma',
  'yahoo.com': 'yahoo',
  'yandex.com': 'yandex',
  'yandex.ru': 'yandex',
  'duckduckgo.com': 'duckduckgo',
};

/**
 * 从 URL 查询参数中提取 UTM 字段
 */
export function parseUtmParams(search: string): Partial<TrafficSource> {
  const params = new URLSearchParams(search);
  const result: Partial<TrafficSource> = {};

  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const keyword = params.get('utm_term');
  const content = params.get('utm_content');

  if (source) result.source = source;
  if (medium) result.medium = medium;
  if (campaign) result.campaign = campaign;
  if (keyword) result.keyword = keyword;
  if (content) result.content = content;

  return result;
}

/**
 * 从 referrer URL 识别搜索引擎来源
 * 返回 { source, medium } 或空对象
 */
export function detectReferrerSource(referrer: string): Partial<TrafficSource> {
  if (!referrer) return {};

  try {
    const hostname = new URL(referrer).hostname;
    for (const [domain, sourceName] of Object.entries(SEARCH_ENGINE_MAP)) {
      if (hostname.includes(domain)) {
        return { source: sourceName, medium: 'organic' };
      }
    }
  } catch {
    // 无效 URL，忽略
  }

  return {};
}

/**
 * 组合 UTM 参数和 referrer 构建完整的 TrafficSource
 * 优先级：UTM 参数 > referrer 识别 > 空字符串（直接访问）
 */
export function buildTrafficSource(search: string, referrer: string): TrafficSource {
  const utmData = parseUtmParams(search);
  const referrerData = detectReferrerSource(referrer);

  return {
    source: utmData.source || referrerData.source || '',
    medium: utmData.medium || referrerData.medium || '',
    campaign: utmData.campaign || '',
    keyword: utmData.keyword || '',
    content: utmData.content || '',
    referrer: referrer || '',
  };
}

/**
 * 保存流量来源到 sessionStorage
 * 仅首次写入，保留原始落地来源
 */
export function saveTrafficSource(trafficSource: TrafficSource): void {
  try {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) return;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(trafficSource));
  } catch {
    // sessionStorage 不可用（SSR、隐私模式等）
  }
}

/**
 * 从 sessionStorage 读取流量来源
 * 无数据时返回默认空对象（直接访问）
 */
export function getTrafficSource(): TrafficSource {
  const emptySource: TrafficSource = {
    source: '',
    medium: '',
    campaign: '',
    keyword: '',
    content: '',
    referrer: '',
  };

  try {
    if (typeof window === 'undefined') return emptySource;
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return emptySource;
    return JSON.parse(stored) as TrafficSource;
  } catch {
    return emptySource;
  }
}
