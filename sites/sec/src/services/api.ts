import { ContactSubmission, ApiResponse, CaptchaData, Article } from '@/types/api';

/**
 * API 服务层
 * 所有接口统一走相对路径 /api/...，由 Nginx 代理到后端 3001 端口
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export type { Article };

export const apiService = {
  async getCaptcha(): Promise<CaptchaData> {
    const response = await fetch(`${API_BASE_URL}/captcha`);
    if (!response.ok) throw new Error('获取验证码失败');
    return response.json();
  },

  async submitContact(data: ContactSubmission): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || result.success === false) {
      throw new Error(result.error || '提交失败，请稍后重试');
    }
    return result;
  },

  async getArticles(): Promise<Article[]> {
    const response = await fetch(`${API_BASE_URL}/sec/articles`);
    if (!response.ok) throw new Error('获取文章列表失败');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.articles) ? data.articles : []);
  },

  async getArticleById(id: string): Promise<Article> {
    const response = await fetch(`${API_BASE_URL}/sec/articles/${id}`);
    if (!response.ok) throw new Error('文章不存在或已下线');
    const articleData = await response.json();
    return articleData.article || articleData;
  },

  async adminLogin(username: string, password: string): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok || result.success === false) {
      throw new Error(result.error || '登录失败');
    }
    return result;
  },
};
