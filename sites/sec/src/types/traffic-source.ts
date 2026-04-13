/**
 * 流量来源数据，随联系表单一起提交给后端
 * 所有字段为字符串，空字符串表示"无数据"（直接访问）
 */
export interface TrafficSource {
  source: string;    // utm_source 或从 referrer 识别的来源
  medium: string;    // utm_medium 或 "organic"
  campaign: string;  // utm_campaign
  keyword: string;   // utm_term
  content: string;   // utm_content
  referrer: string;  // 原始 document.referrer
}
