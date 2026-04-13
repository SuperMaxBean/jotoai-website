import { TrafficSource } from './traffic-source';

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * 验证码数据
 */
export interface CaptchaData {
  captchaId: string;
  svg: string;
}

/**
 * 联系表单提交数据
 */
export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone: string;
  message?: string;
  captchaId: string;
  captchaText: string;
  trafficSource?: TrafficSource;
}

/**
 * 文章
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt: string;
  published: boolean;
  type?: string;
}

/**
 * 更新日志条目
 */
export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: 'feature' | 'fix' | 'improvement';
}
