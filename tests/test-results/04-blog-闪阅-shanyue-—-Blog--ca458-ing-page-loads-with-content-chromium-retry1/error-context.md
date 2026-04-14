# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-blog.spec.ts >> 闪阅 (shanyue) — Blog/Articles >> blog listing page loads with content
- Location: specs/04-blog.spec.ts:9:9

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 1
Received:   1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "闪阅 JOTO 旗下产品" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]:
          - img [ref=e7]
          - img [ref=e10]
        - generic [ref=e12]:
          - generic [ref=e13]: 闪阅
          - generic [ref=e14]: JOTO 旗下产品
      - generic [ref=e15]:
        - link "核心能力" [ref=e16] [cursor=pointer]:
          - /url: /capabilities
        - link "技术架构" [ref=e17] [cursor=pointer]:
          - /url: /architecture
        - link "新闻博客" [ref=e18] [cursor=pointer]:
          - /url: /articles
        - link "联络我们" [ref=e19] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e20]:
        - link "登录" [ref=e21] [cursor=pointer]:
          - /url: /login
        - link "预约演示" [ref=e22] [cursor=pointer]:
          - /url: /contact
  - main [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - img [ref=e29]
            - text: 最新动态
          - heading "产品更新与行业洞察" [level=2] [ref=e32]
          - paragraph [ref=e33]: 深入了解闪阅 AI 在智能阅卷、教育数字化领域的最新进展。
        - generic [ref=e34]:
          - link "作业批改自动化在智能阅卷中的实践探索 作业批改自动化 作业批改自动化在智能阅卷中的实践探索 随着AI技术的深度渗透，作业批改自动化正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析作业批改自动化的应用现状与未来趋势。 一、作业批改自动化的行业背景与... 2026年4月3日 阅读全文" [ref=e35] [cursor=pointer]:
            - /url: /articles/1775205149250
            - img "作业批改自动化在智能阅卷中的实践探索" [ref=e37]
            - generic [ref=e38]:
              - generic [ref=e39]: 作业批改自动化
              - heading "作业批改自动化在智能阅卷中的实践探索" [level=3] [ref=e40]
              - paragraph [ref=e41]: 随着AI技术的深度渗透，作业批改自动化正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析作业批改自动化的应用现状与未来趋势。 一、作业批改自动化的行业背景与...
              - generic [ref=e42]:
                - generic [ref=e43]:
                  - img [ref=e44]
                  - text: 2026年4月3日
                - generic [ref=e46]:
                  - text: 阅读全文
                  - img [ref=e47]
          - link "智能批改：让考试批改更快更准 智能批改 智能批改：让考试批改更快更准 随着AI技术的深度渗透，智能批改正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析智能批改的应用现状与未来趋势。 一、智能批改的行业背景与发展现状 智能阅卷... 2026年4月3日 阅读全文" [ref=e49] [cursor=pointer]:
            - /url: /articles/1775204065487
            - img "智能批改：让考试批改更快更准" [ref=e51]
            - generic [ref=e52]:
              - generic [ref=e53]: 智能批改
              - heading "智能批改：让考试批改更快更准" [level=3] [ref=e54]
              - paragraph [ref=e55]: 随着AI技术的深度渗透，智能批改正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析智能批改的应用现状与未来趋势。 一、智能批改的行业背景与发展现状 智能阅卷...
              - generic [ref=e56]:
                - generic [ref=e57]:
                  - img [ref=e58]
                  - text: 2026年4月3日
                - generic [ref=e60]:
                  - text: 阅读全文
                  - img [ref=e61]
          - link "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南 自动阅卷 自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南 在传统教育评测体系中，大规模考试阅卷一直是耗时耗力的核心痛点：中考、高考等国家级考试动辄动员数千名教师封闭阅卷7-10天，日常作业批改则让一线教师日均加班超2小时，且人工阅卷误差率高达5%-8%，这对... 2026年4月3日 阅读全文" [ref=e63] [cursor=pointer]:
            - /url: /articles/1775198796414
            - img "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南" [ref=e65]
            - generic [ref=e66]:
              - generic [ref=e67]: 自动阅卷
              - heading "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南" [level=3] [ref=e68]
              - paragraph [ref=e69]: 在传统教育评测体系中，大规模考试阅卷一直是耗时耗力的核心痛点：中考、高考等国家级考试动辄动员数千名教师封闭阅卷7-10天，日常作业批改则让一线教师日均加班超2小时，且人工阅卷误差率高达5%-8%，这对...
              - generic [ref=e70]:
                - generic [ref=e71]:
                  - img [ref=e72]
                  - text: 2026年4月3日
                - generic [ref=e74]:
                  - text: 阅读全文
                  - img [ref=e75]
          - link "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径 自动阅卷 自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径 在传统教育评测体系中，大规模考试的阅卷工作一直是耗时耗力的核心痛点。以全国高考为例，每年参与阅卷的教师超过10万人，单科阅卷时长平均达7-10天，不仅需要投入大量人力成本，还容易因教师疲劳、主观判断差... 2026年4月3日 阅读全文" [ref=e77] [cursor=pointer]:
            - /url: /articles/1775198267722
            - img "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径" [ref=e79]
            - generic [ref=e80]:
              - generic [ref=e81]: 自动阅卷
              - heading "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径" [level=3] [ref=e82]
              - paragraph [ref=e83]: 在传统教育评测体系中，大规模考试的阅卷工作一直是耗时耗力的核心痛点。以全国高考为例，每年参与阅卷的教师超过10万人，单科阅卷时长平均达7-10天，不仅需要投入大量人力成本，还容易因教师疲劳、主观判断差...
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - img [ref=e86]
                  - text: 2026年4月3日
                - generic [ref=e88]:
                  - text: 阅读全文
                  - img [ref=e89]
          - link "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南 教育AI 教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南 一线中小学教师平均每周要花费12-15小时用于批改作业和试卷，其中主观题批改占比超过60%，不仅消耗大量精力，还容易出现评分一致性偏差，比如同一份作文，不同老师评分差可能达到10-15分，严重影响评测... 2026年4月3日 阅读全文" [ref=e91] [cursor=pointer]:
            - /url: /articles/1775197875627
            - img "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南" [ref=e93]
            - generic [ref=e94]:
              - generic [ref=e95]: 教育AI
              - heading "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南" [level=3] [ref=e96]
              - paragraph [ref=e97]: 一线中小学教师平均每周要花费12-15小时用于批改作业和试卷，其中主观题批改占比超过60%，不仅消耗大量精力，还容易出现评分一致性偏差，比如同一份作文，不同老师评分差可能达到10-15分，严重影响评测...
              - generic [ref=e98]:
                - generic [ref=e99]:
                  - img [ref=e100]
                  - text: 2026年4月3日
                - generic [ref=e102]:
                  - text: 阅读全文
                  - img [ref=e103]
      - generic [ref=e112]:
        - generic [ref=e113]:
          - img [ref=e114]
          - text: 开启智能阅卷新时代
        - heading "让 AI 替您批卷 把时间还给教学" [level=2] [ref=e116]:
          - text: 让 AI 替您批卷
          - text: 把时间还给教学
        - paragraph [ref=e117]: 立即体验闪阅 AI 全科阅卷系统，感受 50 倍效率提升带来的教学变革
        - generic [ref=e118]:
          - generic [ref=e119]:
            - img [ref=e120]
            - text: 免费试用 14 天
          - generic [ref=e123]:
            - img [ref=e124]
            - text: 专属技术支持
          - generic [ref=e127]:
            - img [ref=e128]
            - text: 数据本地化部署
          - generic [ref=e131]:
            - img [ref=e132]
            - text: 不满意随时取消
        - generic [ref=e135]:
          - button "免费试用" [ref=e136]:
            - img [ref=e137]
            - text: 免费试用
            - img [ref=e142]
          - button "预约演示" [ref=e144]:
            - img [ref=e145]
            - text: 预约演示
  - contentinfo [ref=e147]:
    - generic [ref=e148]:
      - generic [ref=e149]:
        - generic [ref=e150]:
          - link "闪阅" [ref=e151] [cursor=pointer]:
            - /url: /
            - generic [ref=e152]:
              - img [ref=e153]
              - img [ref=e156]
            - generic [ref=e158]: 闪阅
          - paragraph [ref=e159]: 面向未来的教学评估与资产沉淀平台，让老师从"批卷机器"回归"教学设计者"。
        - generic [ref=e160]:
          - heading "产品" [level=4] [ref=e161]
          - list [ref=e162]:
            - listitem [ref=e163]:
              - link "核心能力" [ref=e164] [cursor=pointer]:
                - /url: /capabilities
            - listitem [ref=e165]:
              - link "技术架构" [ref=e166] [cursor=pointer]:
                - /url: /architecture
            - listitem [ref=e167]:
              - link "登录" [ref=e168] [cursor=pointer]:
                - /url: /login
        - generic [ref=e169]:
          - heading "资源" [level=4] [ref=e170]
          - list [ref=e171]:
            - listitem [ref=e172]:
              - link "新闻博客" [ref=e173] [cursor=pointer]:
                - /url: /articles
            - listitem [ref=e174]:
              - link "隐私政策" [ref=e175] [cursor=pointer]:
                - /url: /privacy
        - generic [ref=e176]:
          - heading "联系" [level=4] [ref=e177]
          - list [ref=e178]:
            - listitem [ref=e179]:
              - link "联络我们" [ref=e180] [cursor=pointer]:
                - /url: /contact
            - listitem [ref=e181]: contact@joto.ai
      - generic [ref=e182]:
        - paragraph [ref=e183]: © 2026 JOTO AI. All rights reserved.
        - generic [ref=e184]:
          - link "隐私政策" [ref=e185] [cursor=pointer]:
            - /url: /privacy
          - generic [ref=e186]: 服务条款
  - alert [ref=e187]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { SITES, BLOG_SITES } from '../fixtures/test-data';
  3  | 
  4  | for (const [siteId, blogCfg] of Object.entries(BLOG_SITES)) {
  5  |   const site = SITES[siteId as keyof typeof SITES];
  6  | 
  7  |   test.describe(`${site.name} (${siteId}) — Blog/Articles`, () => {
  8  | 
  9  |     test('blog listing page loads with content', async ({ page }) => {
  10 |       const res = await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'domcontentloaded' });
  11 |       expect(res?.status()).toBe(200);
  12 |       // Page should have substantial content (articles rendered in HTML)
  13 |       const html = await res?.text();
  14 |       expect(html!.length).toBeGreaterThan(5000);
  15 |       // Should have at least one heading (article title)
  16 |       const headings = page.locator('h1, h2, h3');
  17 |       const count = await headings.count();
> 18 |       expect(count).toBeGreaterThan(1);
     |                     ^ Error: expect(received).toBeGreaterThan(expected)
  19 |     });
  20 | 
  21 |     test('blog listing has proper heading structure', async ({ page }) => {
  22 |       await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'domcontentloaded' });
  23 |       const heading = page.locator('h1, h2').first();
  24 |       await expect(heading).toBeVisible({ timeout: 5000 });
  25 |     });
  26 | 
  27 |     test('blog article detail page loads', async ({ page, request }) => {
  28 |       // Directly test a known article URL via API
  29 |       const res = await request.get(`${site.url}${blogCfg.detailPrefix}1`);
  30 |       // Some sites may 404 if article 1 doesn't exist; just check it doesn't 500
  31 |       expect(res.status()).toBeLessThan(500);
  32 |       if (res.status() === 200) {
  33 |         const html = await res.text();
  34 |         expect(html.length).toBeGreaterThan(3000);
  35 |       }
  36 |     });
  37 | 
  38 |     test('blog page images are accessible', async ({ page }) => {
  39 |       await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'load', timeout: 15000 });
  40 |       // Check that main content images (not icons/svgs) have valid src
  41 |       const images = page.locator('img[src*="/blog"], img[src*="/images"], img[src*="unsplash"]');
  42 |       const count = await images.count();
  43 |       for (let i = 0; i < Math.min(count, 3); i++) {
  44 |         const src = await images.nth(i).getAttribute('src');
  45 |         expect(src).toBeTruthy();
  46 |       }
  47 |     });
  48 |   });
  49 | }
  50 | 
```