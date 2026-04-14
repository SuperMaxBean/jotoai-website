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
      - link "ShanyueAI A JOTO Product" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]:
          - img [ref=e7]
          - img [ref=e10]
        - generic [ref=e12]:
          - generic [ref=e13]: ShanyueAI
          - generic [ref=e14]: A JOTO Product
      - generic [ref=e15]:
        - link "Capabilities" [ref=e16] [cursor=pointer]:
          - /url: /capabilities
        - link "Architecture" [ref=e17] [cursor=pointer]:
          - /url: /architecture
        - link "Blog" [ref=e18] [cursor=pointer]:
          - /url: /articles
        - link "Contact" [ref=e19] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e20]:
        - button "中文" [ref=e21]
        - link "Log In" [ref=e22] [cursor=pointer]:
          - /url: /login
        - link "Book a Demo" [ref=e23] [cursor=pointer]:
          - /url: /contact
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - img [ref=e30]
            - text: 最新动态
          - heading "产品更新与行业洞察" [level=2] [ref=e33]
          - paragraph [ref=e34]: 深入了解闪阅 AI 在智能阅卷、教育数字化领域的最新进展。
        - generic [ref=e35]:
          - link "作业批改自动化在智能阅卷中的实践探索 作业批改自动化 作业批改自动化在智能阅卷中的实践探索 随着AI技术的深度渗透，作业批改自动化正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析作业批改自动化的应用现状与未来趋势。 一、作业批改自动化的行业背景与... 2026年4月3日 阅读全文" [ref=e36] [cursor=pointer]:
            - /url: /articles/1775205149250
            - img "作业批改自动化在智能阅卷中的实践探索" [ref=e38]
            - generic [ref=e39]:
              - generic [ref=e40]: 作业批改自动化
              - heading "作业批改自动化在智能阅卷中的实践探索" [level=3] [ref=e41]
              - paragraph [ref=e42]: 随着AI技术的深度渗透，作业批改自动化正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析作业批改自动化的应用现状与未来趋势。 一、作业批改自动化的行业背景与...
              - generic [ref=e43]:
                - generic [ref=e44]:
                  - img [ref=e45]
                  - text: 2026年4月3日
                - generic [ref=e47]:
                  - text: 阅读全文
                  - img [ref=e48]
          - link "智能批改：让考试批改更快更准 智能批改 智能批改：让考试批改更快更准 随着AI技术的深度渗透，智能批改正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析智能批改的应用现状与未来趋势。 一、智能批改的行业背景与发展现状 智能阅卷... 2026年4月3日 阅读全文" [ref=e50] [cursor=pointer]:
            - /url: /articles/1775204065487
            - img "智能批改：让考试批改更快更准" [ref=e52]
            - generic [ref=e53]:
              - generic [ref=e54]: 智能批改
              - heading "智能批改：让考试批改更快更准" [level=3] [ref=e55]
              - paragraph [ref=e56]: 随着AI技术的深度渗透，智能批改正在智能阅卷AI教育评测领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析智能批改的应用现状与未来趋势。 一、智能批改的行业背景与发展现状 智能阅卷...
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - img [ref=e59]
                  - text: 2026年4月3日
                - generic [ref=e61]:
                  - text: 阅读全文
                  - img [ref=e62]
          - link "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南 自动阅卷 自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南 在传统教育评测体系中，大规模考试阅卷一直是耗时耗力的核心痛点：中考、高考等国家级考试动辄动员数千名教师封闭阅卷7-10天，日常作业批改则让一线教师日均加班超2小时，且人工阅卷误差率高达5%-8%，这对... 2026年4月3日 阅读全文" [ref=e64] [cursor=pointer]:
            - /url: /articles/1775198796414
            - img "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南" [ref=e66]
            - generic [ref=e67]:
              - generic [ref=e68]: 自动阅卷
              - heading "自动阅卷：解锁教育评测新效率的自动阅卷技术与实战指南" [level=3] [ref=e69]
              - paragraph [ref=e70]: 在传统教育评测体系中，大规模考试阅卷一直是耗时耗力的核心痛点：中考、高考等国家级考试动辄动员数千名教师封闭阅卷7-10天，日常作业批改则让一线教师日均加班超2小时，且人工阅卷误差率高达5%-8%，这对...
              - generic [ref=e71]:
                - generic [ref=e72]:
                  - img [ref=e73]
                  - text: 2026年4月3日
                - generic [ref=e75]:
                  - text: 阅读全文
                  - img [ref=e76]
          - link "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径 自动阅卷 自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径 在传统教育评测体系中，大规模考试的阅卷工作一直是耗时耗力的核心痛点。以全国高考为例，每年参与阅卷的教师超过10万人，单科阅卷时长平均达7-10天，不仅需要投入大量人力成本，还容易因教师疲劳、主观判断差... 2026年4月3日 阅读全文" [ref=e78] [cursor=pointer]:
            - /url: /articles/1775198267722
            - img "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径" [ref=e80]
            - generic [ref=e81]:
              - generic [ref=e82]: 自动阅卷
              - heading "自动阅卷：从效率革命到精准评测，自动阅卷在EdTech的核心落地路径" [level=3] [ref=e83]
              - paragraph [ref=e84]: 在传统教育评测体系中，大规模考试的阅卷工作一直是耗时耗力的核心痛点。以全国高考为例，每年参与阅卷的教师超过10万人，单科阅卷时长平均达7-10天，不仅需要投入大量人力成本，还容易因教师疲劳、主观判断差...
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - img [ref=e87]
                  - text: 2026年4月3日
                - generic [ref=e89]:
                  - text: 阅读全文
                  - img [ref=e90]
          - link "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南 教育AI 教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南 一线中小学教师平均每周要花费12-15小时用于批改作业和试卷，其中主观题批改占比超过60%，不仅消耗大量精力，还容易出现评分一致性偏差，比如同一份作文，不同老师评分差可能达到10-15分，严重影响评测... 2026年4月3日 阅读全文" [ref=e92] [cursor=pointer]:
            - /url: /articles/1775197875627
            - img "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南" [ref=e94]
            - generic [ref=e95]:
              - generic [ref=e96]: 教育AI
              - heading "教育AI赋能智能阅卷：教育AI评测从痛点到落地的实践指南" [level=3] [ref=e97]
              - paragraph [ref=e98]: 一线中小学教师平均每周要花费12-15小时用于批改作业和试卷，其中主观题批改占比超过60%，不仅消耗大量精力，还容易出现评分一致性偏差，比如同一份作文，不同老师评分差可能达到10-15分，严重影响评测...
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - img [ref=e101]
                  - text: 2026年4月3日
                - generic [ref=e103]:
                  - text: 阅读全文
                  - img [ref=e104]
      - generic [ref=e113]:
        - generic [ref=e114]:
          - img [ref=e115]
          - text: Start the Smart Grading Era
        - heading "Let AI Grade for You Give Time Back to Teaching" [level=2] [ref=e117]:
          - text: Let AI Grade for You
          - text: Give Time Back to Teaching
        - paragraph [ref=e118]: Experience ShanyueAI’s all-subject grading system now and feel the transformation that a 50x efficiency boost brings to education
        - generic [ref=e119]:
          - generic [ref=e120]:
            - img [ref=e121]
            - text: Free 14-day trial
          - generic [ref=e124]:
            - img [ref=e125]
            - text: Dedicated tech support
          - generic [ref=e128]:
            - img [ref=e129]
            - text: On-premise data deployment
          - generic [ref=e132]:
            - img [ref=e133]
            - text: Cancel anytime
        - generic [ref=e136]:
          - button "Start Free Trial" [ref=e137]:
            - img [ref=e138]
            - text: Start Free Trial
            - img [ref=e143]
          - button "Book a Demo" [ref=e145]:
            - img [ref=e146]
            - text: Book a Demo
  - contentinfo [ref=e148]:
    - generic [ref=e149]:
      - generic [ref=e150]:
        - generic [ref=e151]:
          - link "ShanyueAI" [ref=e152] [cursor=pointer]:
            - /url: /
            - generic [ref=e153]:
              - img [ref=e154]
              - img [ref=e157]
            - generic [ref=e159]: ShanyueAI
          - paragraph [ref=e160]: A future-ready assessment and teaching-asset platform — freeing teachers from repetitive grading to focus on instructional design.
        - generic [ref=e161]:
          - heading "Product" [level=4] [ref=e162]
          - list [ref=e163]:
            - listitem [ref=e164]:
              - link "Capabilities" [ref=e165] [cursor=pointer]:
                - /url: /capabilities
            - listitem [ref=e166]:
              - link "Architecture" [ref=e167] [cursor=pointer]:
                - /url: /architecture
            - listitem [ref=e168]:
              - link "Log In" [ref=e169] [cursor=pointer]:
                - /url: /login
        - generic [ref=e170]:
          - heading "Resources" [level=4] [ref=e171]
          - list [ref=e172]:
            - listitem [ref=e173]:
              - link "Blog" [ref=e174] [cursor=pointer]:
                - /url: /articles
            - listitem [ref=e175]:
              - link "Privacy Policy" [ref=e176] [cursor=pointer]:
                - /url: /privacy
        - generic [ref=e177]:
          - heading "Contact" [level=4] [ref=e178]
          - list [ref=e179]:
            - listitem [ref=e180]:
              - link "Contact Us" [ref=e181] [cursor=pointer]:
                - /url: /contact
            - listitem [ref=e182]: contact@joto.ai
      - generic [ref=e183]:
        - paragraph [ref=e184]: © 2026 JOTO AI. All rights reserved.
        - generic [ref=e185]:
          - link "Privacy Policy" [ref=e186] [cursor=pointer]:
            - /url: /privacy
          - generic [ref=e187]: Terms of Service
  - alert [ref=e188]
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