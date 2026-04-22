# JOTO Translator — 前端对接文档

> 发给对方开发/AI 协作用。包含:**Blog 展示** + **联系我们表单** 两部分对接。
> 后端完全由 JOTO.AI 托管,对方前端只负责拉数据 + 渲染 + 提交表单。

---

## 0. 对接清单(TL;DR)

| 模块 | 对方需要做 | 预计工作量 |
|---|---|---|
| Blog 列表页 `/blog` | GET API + 渲染卡片列表 | 1-2 小时 |
| Blog 详情页 `/blog/[id]` | GET API + 渲染 HTML + 基础样式 | 2-3 小时 |
| 联系表单 `/contact` | GET 验证码 + POST 提交 + 成功/错误态 | 2-3 小时 |
| 微信公众号二维码 | 改 1 行 `<img src>`,无其他工作 | 5 分钟 |
| 样式打磨 | Tailwind Typography 或自写 CSS | 1-2 小时 |

**总计:6-10 小时的前端工作。** 完全不需要数据库、不需要后端、不需要管理界面。

---

## 1. 核心参数

| 参数 | 值 |
|---|---|
| **Site ID** | `translator` |
| **API Base URL** | `https://admin.jotoai.com` |
| **图片前缀** | `https://admin.jotoai.com`(相对路径 `/images/...` 需拼接) |
| **鉴权** | 无需(公共只读 API + captcha 限流) |
| **CORS** | 已开放,任何域名可跨域 |

---

## 2. Blog 展示

### 2.1 文章列表

```http
GET https://admin.jotoai.com/api/translator/articles
```

**返回结构:**
```json
{
  "articles": [
    {
      "id": 1776402570885,
      "title": "超越语言边界:AI驱动的专业文档翻译如何重塑企业全球化战略",
      "excerpt": "首段摘要 200 字,可以直接作为卡片描述...",
      "imageUrl": "/images/articles/unsplash/SrJuOjX2qso.jpg",
      "createdAt": "2026-04-17T05:09:30.000Z",
      "keyword": "专业文档翻译",
      "readingTime": 5,
      "wordCount": 1200,
      "tags": ["AI文档翻译", "机器翻译质量"]
    }
  ]
}
```

### 2.2 文章详情

```http
GET https://admin.jotoai.com/api/translator/articles/{id}
```

**返回结构:**
```json
{
  "article": {
    "id": 1776402570885,
    "title": "...",
    "content": "<h2>...</h2><p>...</p><strong>...</strong>",
    "imageUrl": "/images/articles/unsplash/xxx.jpg",
    "createdAt": "2026-04-17T05:09:30.000Z",
    "keyword": "专业文档翻译",
    "excerpt": "...",
    "readingTime": 5,
    "wordCount": 1200,
    "tags": ["..."],
    "toc": [{ "level": 2, "text": "章节标题", "id": "s1" }],
    "markdown": "原始 markdown(一般不用)"
  }
}
```

### 2.3 ⚠️ 关键:`content` 字段已经是渲染好的 HTML

`content` 只会包含这些标签:
```
<h2> <h3> <p> <strong> <em> <ul> <ol> <li> <a> <img> <blockquote>
```

服务端已经用 `marked` 解析并清洗过,**不要再当 markdown 解析一遍**(会双重转义坏掉)。直接渲染:

| 框架 | 代码 |
|---|---|
| React | `<div dangerouslySetInnerHTML={{ __html: article.content }} />` |
| Vue 3 | `<div v-html="article.content"></div>` |
| Svelte | `{@html article.content}` |
| 原生 JS | `container.innerHTML = article.content` |

### 2.4 图片路径处理

`imageUrl` 可能是相对路径,要拼前缀:

```js
const imgSrc = article.imageUrl?.startsWith('/')
  ? 'https://admin.jotoai.com' + article.imageUrl
  : article.imageUrl;
```

### 2.5 参考实现(React)

```tsx
// /blog 列表页
export default function BlogList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('https://admin.jotoai.com/api/translator/articles')
      .then(r => r.json())
      .then(d => setArticles(d.articles || []));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map(a => (
        <Link key={a.id} to={`/blog/${a.id}`} className="block">
          <img src={absImg(a.imageUrl)} alt={a.title}
               className="aspect-video w-full rounded-xl object-cover" />
          <span className="mt-3 inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {a.keyword}
          </span>
          <h3 className="mt-2 font-bold text-lg">{a.title}</h3>
          <p className="mt-2 text-sm text-slate-600 line-clamp-3">{a.excerpt}</p>
          <time className="mt-2 block text-xs text-slate-400">
            {new Date(a.createdAt).toLocaleDateString('zh-CN')} · {a.readingTime} 分钟阅读
          </time>
        </Link>
      ))}
    </div>
  );
}

function absImg(url) {
  return url?.startsWith('/') ? 'https://admin.jotoai.com' + url : url;
}
```

```tsx
// /blog/[id] 详情页
export default function BlogDetail({ id }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`https://admin.jotoai.com/api/translator/articles/${id}`)
      .then(r => r.json())
      .then(d => setArticle(d.article));
  }, [id]);

  if (!article) return <div>加载中...</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <img src={absImg(article.imageUrl)} alt={article.title}
           className="w-full aspect-[21/9] rounded-2xl object-cover mb-8" />
      <h1 className="text-4xl font-extrabold mb-4">{article.title}</h1>
      <div className="text-sm text-slate-500 mb-8">
        {new Date(article.createdAt).toLocaleDateString('zh-CN')} · {article.readingTime} 分钟阅读
      </div>
      <div
        className="prose prose-slate prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
```

### 2.6 样式(强烈建议)

用 Tailwind Typography plugin,一套搞定:

```bash
npm install -D @tailwindcss/typography
```

```js
// tailwind.config.js
plugins: [require('@tailwindcss/typography')]
```

```jsx
<div className="prose prose-slate prose-lg max-w-none"
     dangerouslySetInnerHTML={{ __html: article.content }} />
```

或者自写 CSS(最小必要):

```css
.article-content h2 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; color: #111; }
.article-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #222; }
.article-content p  { line-height: 1.75; margin-bottom: 1rem; color: #4b5563; }
.article-content strong { color: #111; font-weight: 700; }
.article-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.article-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
.article-content li { margin-bottom: 0.5rem; }
.article-content a  { color: #2563eb; text-decoration: underline; }
.article-content img { border-radius: 0.75rem; max-width: 100%; height: auto; margin: 1rem 0; }
.article-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #6b7280; font-style: italic; }
```

### 2.7 现成的样本文章(可立即测试)

| ID | 标题 |
|---|---|
| `1776402082430` | 跨境商业博弈中的关键一环:如何利用 AI 技术实现高质量合同翻译 |
| `1776402268231` | 跨境出海的必经之路:如何通过高质量跨境本地化打破市场壁垒? |
| `1776402570885` | 超越语言边界:AI驱动的专业文档翻译如何重塑企业全球化战略 |

直接浏览器打开 <https://admin.jotoai.com/api/translator/articles> 可预览 JSON。

---

## 3. 联系我们表单

> 提交成功后我们这边会自动:保存到数据库 + 发邮件通知 tomi@jototech.cn + 飞书机器人推送(如已配置)。
> **你前端只需要展示表单、调两个 API、处理成功/失败态。**

### 3.1 获取验证码

```http
GET https://admin.jotoai.com/api/captcha
```

**返回:**
```json
{
  "captchaId": "1776395237768xa2uh",
  "svg": "data:image/svg+xml;base64,PHN2Zy..."
}
```

- `captchaId` — 字符串,提交表单时要一起传回来
- `svg` — 可以直接作为 `<img src="...">` 的值(data URL 格式的 SVG 图)
- 5 分钟后过期,过期后重新拉一张

### 3.2 提交表单

```http
POST https://admin.jotoai.com/api/translator/contact
Content-Type: application/json

{
  "name":        "张三",          // 必填,用户姓名
  "company":     "某某公司",       // 必填,公司/机构名
  "email":       "zs@example.com", // 必填,邮箱
  "phone":       "13800000000",    // 必填,手机号
  "message":     "咨询内容...",     // 可选,留言
  "captchaId":   "...",            // 必填,从 /api/captcha 取到的
  "captchaText": "AbCd"            // 必填,用户输入的验证码
}
```

**成功响应:**
```json
{ "success": true, "message": "提交成功,我们会尽快与您联系" }
```

**失败响应:**
```json
{ "success": false, "error": "验证码错误或已过期" }
```

常见 error:
- `请填写公司或机构名称`(company 为空)
- `请输入验证码`(captchaId 或 captchaText 缺失)
- `验证码错误或已过期`(过期或字符不匹配)

### 3.3 参考实现(React)

```tsx
export default function ContactForm() {
  const [captcha, setCaptcha] = useState<{id: string, svg: string} | null>(null);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    message: '', captchaText: ''
  });
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function loadCaptcha() {
    const r = await fetch('https://admin.jotoai.com/api/captcha');
    const d = await r.json();
    setCaptcha({ id: d.captchaId, svg: d.svg });
  }

  useEffect(() => { loadCaptcha(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrMsg('');
    try {
      const r = await fetch('https://admin.jotoai.com/api/translator/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          captchaId: captcha?.id,
        }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        setStatus('success');
        setForm({ name: '', company: '', email: '', phone: '', message: '', captchaText: '' });
        loadCaptcha();
      } else {
        setStatus('error');
        setErrMsg(d.error || '提交失败,请稍后重试');
        loadCaptcha(); // 错误后刷新验证码
      }
    } catch {
      setStatus('error');
      setErrMsg('网络错误,请检查连接');
      loadCaptcha();
    }
  }

  const upd = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      {status === 'success' && (
        <div className="p-3 bg-green-50 text-green-700 rounded">提交成功!我们会尽快与您联系。</div>
      )}
      {status === 'error' && (
        <div className="p-3 bg-red-50 text-red-700 rounded">{errMsg}</div>
      )}

      <input required placeholder="姓名 *"
             value={form.name} onChange={upd('name')}
             className="w-full px-4 py-3 border rounded" />
      <input required placeholder="公司/机构 *"
             value={form.company} onChange={upd('company')}
             className="w-full px-4 py-3 border rounded" />
      <input required type="email" placeholder="邮箱 *"
             value={form.email} onChange={upd('email')}
             className="w-full px-4 py-3 border rounded" />
      <input required type="tel" placeholder="手机号 *"
             value={form.phone} onChange={upd('phone')}
             className="w-full px-4 py-3 border rounded" />
      <textarea placeholder="留言(可选)"
                value={form.message} onChange={upd('message')}
                className="w-full px-4 py-3 border rounded" rows={3} />

      <div className="flex items-center gap-3">
        <input required placeholder="验证码 *"
               value={form.captchaText} onChange={upd('captchaText')}
               className="flex-1 px-4 py-3 border rounded" />
        {captcha && (
          <img src={captcha.svg} alt="验证码"
               className="h-11 rounded border cursor-pointer"
               onClick={loadCaptcha} title="点击刷新" />
        )}
      </div>

      <button type="submit" disabled={status === 'submitting'}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded disabled:opacity-50">
        {status === 'submitting' ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

### 3.4 注意事项

- **验证码必须新鲜**:5 分钟过期,提交失败后要重新拉
- **phone 字段不校验格式**:任意字符串都收,前端要自己做校验
- **提交成功后清空表单 + 刷新验证码**,避免用户重复提交同一份
- **错误态也要刷新验证码**(后端验证失败后验证码已失效,必须换一张)

---

## 4. 微信公众号二维码(必读,5 分钟改完)

你们站点目前展示的微信二维码是自己托管的文件(`/contact-wechat-qr.png`),和 JOTO 其他产品站点的公众号是**两个不同的公众号**。为了统一运营(JOTO 所有产品共用同一个公众号),请改成**直接引用我们托管的中心化 QR**。

### 4.1 唯一要做的事

把所有引用本地 QR 的 `<img src>` 改成我们的 URL:

```diff
- <img src="/contact-wechat-qr.png" alt="WeChat QR">
+ <img src="https://admin.jotoai.com/brand/wechat-qr.png" alt="WeChat QR">
```

**就这一行。** 图片 CORS 已开放(`Access-Control-Allow-Origin: *`),直接 `<img src>` 引用即可,不需要任何 JS。

### 4.2 工作原理

- JOTO.AI 内部管理员在后台上传公众号 QR
- 上传完成后 5 分钟内所有站点(含你们)的浏览器自动同步新 QR —— 因为 HTTP 响应头 `Cache-Control: max-age=300`
- 如果需要立即失效缓存,使用下面的 info 接口拿版本号做 cache-bust

### 4.3(可选)配套的 metadata 接口

如果你们想显示 "最近更新时间"、控制缓存、或者在 QR 文件不存在时做降级处理,可以调这个公开端点:

```
GET https://admin.jotoai.com/api/brand/wechat-qr/info
```

返回:
```json
{
  "exists": true,
  "url": "https://admin.jotoai.com/brand/wechat-qr.png",
  "size": 98928,
  "updatedAt": "2026-04-17T14:56:29.724Z",
  "version": 1776437789724.1843
}
```

或 `{"exists": false, "url": null}` 当尚未上传。

### 4.4 强力 cache-bust(可选)

如果希望用户浏览器缓存在 5 分钟内也能拿到最新 QR,在页面加载时:

```jsx
const [qr, setQr] = useState('https://admin.jotoai.com/brand/wechat-qr.png');

useEffect(() => {
  fetch('https://admin.jotoai.com/api/brand/wechat-qr/info')
    .then(r => r.json())
    .then(d => {
      if (d.exists) setQr(`${d.url}?v=${d.version}`);
    });
}, []);

// <img src={qr} alt="WeChat QR" />
```

### 4.5 不要做的事

- ❌ 不要再自建 QR 文件本地托管(会导致和 JOTO 其他站点的 QR 不一致)
- ❌ 不要用 `api.qrserver.com` 动态生成 QR(那不是真公众号二维码,扫了没用)
- ❌ 不要把 URL 复制一份到你们的 CDN(会绕过 JOTO 更新机制,失去中心化意义)

---

## 5. SEO 建议(可选但推荐)

### 4.1 列表页
```html
<title>JOTO Translator Blog — AI 文档翻译与本地化洞察</title>
<meta name="description" content="AI 文档翻译、多语言本地化、术语库管理、跨境业务出海的实战经验与行业洞察。">
```

### 4.2 详情页(动态)
```html
<title>{{ article.title }} | JOTO Translator Blog</title>
<meta name="description" content="{{ article.excerpt }}">
<meta property="og:title"       content="{{ article.title }}">
<meta property="og:description" content="{{ article.excerpt }}">
<meta property="og:image"       content="{{ absImg(article.imageUrl) }}">
<meta property="og:type"        content="article">
```

### 4.3 sitemap.xml

可以在你的 sitemap 里列出每篇文章的 URL,爬虫跟着拉:
```xml
<url>
  <loc>https://translator.jototech.cn/blog/1776402570885</loc>
  <lastmod>2026-04-17</lastmod>
</url>
```

用一次 `GET /api/translator/articles` 拉到所有 id 后动态生成即可。

---

## 6. 性能与缓存建议

- **客户端缓存列表 5 分钟**(React Query / SWR 的 `staleTime: 5 * 60 * 1000`)
- **图片懒加载**:`<img loading="lazy">`
- **Next.js / Nuxt 用户**:用 SSG 在 build 时拉取所有文章并预渲染,SEO 最佳
  - Next.js `getStaticPaths` + `getStaticProps` + `revalidate: 600`
  - Nuxt 3 `generate: { routes: ... }`
- **纯 CSR 站**:首屏显示 skeleton → API 返回后再渲染

---

## 7. 常见错误与调试

| 问题 | 原因 | 修复 |
|---|---|---|
| 控制台报 CORS | 确认用的是完整 URL `https://admin.jotoai.com/...`,不是相对路径 | 加域名 |
| 文章内容显示成 `<h2>xx</h2>` 字符串 | 没用 `v-html` / `dangerouslySetInnerHTML`,被当文本转义了 | 改用 `innerHTML` 方式 |
| 文章渲染成一大段无样式 | 没装 Tailwind Typography 或没加 `.prose` | 见 §2.6 |
| 图片 404 | imageUrl 是相对路径,没拼 `https://admin.jotoai.com` 前缀 | 见 §2.4 |
| 表单提交 400 | 缺 company 字段或 captcha 不对 | 见 §3.2 错误表 |
| 验证码图显示不出来 | 没把 `svg` 字段当 src | `<img src={captcha.svg}>` 就行,它是 data URL |

---

## 8. 不要做的事

- ❌ 不要把 `content` 当 markdown 再解析一遍
- ❌ 不要本地缓存文章内容超过 10 分钟(会发新文章)
- ❌ 不要把 `id` 当字符串哈希(它是数字)
- ❌ 不要硬编码样本文章 ID 到代码里(用 API 动态拉)
- ❌ 不要绕过验证码(后端强制校验)
- ❌ 不要用 `localhost` 测试联系表单(captcha 按域名关联)

---

## 9. 对接完成后的验收清单

- [ ] `/blog` 页面能看到 3 篇样本文章(或你刷新后我们生成的更多)
- [ ] 点击卡片能跳到 `/blog/{id}` 详情页
- [ ] 详情页顶部有大图,标题是 `<h1>`,正文有 `<h2>/<p>/<strong>` 等样式
- [ ] 提交联系表单,你的邮箱(如果你是 partner 的 ops)能收到 `[JOTO Translator] 新的联系表单` 邮件
- [ ] 验证码点击能刷新、提交失败后自动刷新
- [ ] 移动端(手机打开)样式正常,不会挤成一团
- [ ] 微信二维码改成 `https://admin.jotoai.com/brand/wechat-qr.png` 后,页面能正常加载该图片(不再出现 `/contact-wechat-qr.png` 或 `api.qrserver.com` 这样的旧引用)

---

## 10. 联系我

对接中遇到问题、需要更多样本文章、想改品牌名(目前暂用 "JOTO Translator")、想加新功能,邮件或微信找我。

— JOTO.AI 技术团队
