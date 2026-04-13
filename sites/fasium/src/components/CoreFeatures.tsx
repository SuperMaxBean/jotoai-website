'use client';
import React from 'react';
import { motion } from 'motion/react';

const features = [
  {
    title: "AI助手提示设计",
    subtitle: "用自然语言驱动设计",
    description: "无需学习复杂的 prompt 写法，用设计师日常的专业语言直接和 AI 对话。FasiumAI 内置服装行业知识，能准确理解“泡泡袖碎花连衣裙”、“工装风拼接设计”等专业描述，即刻转化为可执行的设计方案。",
    bullets: [
      "内置服装行业设计语言库",
      "支持中英文混合描述输入",
      "实时预览 AI 理解效果，随时调整"
    ],
    image: "/feat-1-ai-prompt.png", // <--- 在这里替换第一张图片的路径
    prompt: "A sleek dark-themed product UI screenshot for a fashion design AI platform. The scene shows a split-screen interface: on the left, a design canvas displays a floral midi dress rendered on three female models (front, side, back view) on a light dotted grid background. On the right, a floating chat assistant panel labeled \"AI 助手\" with a purple lightning bolt icon. The chat shows a user message bubble in deep blue: \"给我一些设计建议？\" and below it, four quick-reply suggestion chips in light gray rounded rectangles: \"什么风格的服装？\" \"面料如何选择搭配？\" \"有哪些版型可考虑？\" \"如何快速上板呈现？\". The overall UI is clean and minimal with a white canvas area. The image is framed inside a dark #0a0a0a background with a subtle dark card/window chrome border and soft drop shadow. Orange (#f97316) accent used on small interactive elements. Studio lighting, sharp UI, high-fidelity product screenshot style, 16:9 aspect ratio, marketing illustration quality. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "快速衍生设计",
    subtitle: "一个灵感，无限可能",
    description: "上传任意参考图，AI 自动生成数十种风格衍生方案。调整廓形、换色系、改图案密度，几秒钟内完成设计师过去需要一整天的变体工作，极大拓展创意边界。",
    bullets: [
      "单一设计一键裂变 20+ 变体",
      "支持色彩、廓形、图案多维调整",
      "保持品牌风格一致性"
    ],
    image: "/feat-2-derive.png", // <--- 在这里替换第二张图片的路径
    prompt: "A high-quality dark-background marketing image for a fashion AI platform. Center of the image: a white rounded UI card labeled \"创意衍生节点 / 从参考图生成多套衍生方向\" showing a floral blue A-line dress as input reference. Radiating outward from center via thin blue connecting lines are four groups of garment variants on the canvas: top-left shows a sage green midi dress (front/back/side views), bottom-left shows a floral bell-sleeve dress in blue, bottom-right shows the same silhouette in earthy tones, top-right shows a darker version. Each cluster is inside a soft white rounded card labeled \"衍生方案 1/2/3/4\" with a \"NEW\" green badge. The entire canvas sits on a light dotted grid. The scene is framed with a dark #0a0a0a background border and subtle orange glow on one connecting line. Clean SaaS product screenshot aesthetic, ultra-sharp UI details, professional fashion tech marketing visual, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "直观地感受你的画板",
    subtitle: "所想即所见的设计空间",
    description: "交互式设计画板让你实时拖拽、组合、预览所有设计元素。花型、面料、配色、版型在同一个画布上自由组合，直观感受最终成衣效果，告别在不同文件和工具间反复切换的割裂感。",
    bullets: [
      "花型 + 面料 + 版型实时组合预览",
      "拖拽操作，直觉化使用体验",
      "一键保存灵感方案"
    ],
    image: "/feat-3-canvas.png", // <--- 在这里替换第三张图片的路径
    prompt: "A wide-angle product screenshot of an infinite fashion design moodboard canvas for an AI design platform. The canvas is a light dotted grid filled with dozens of fashion images: red blazer sets, cream wide-leg pants, green tailored suits, floral dresses, accessories (bags, shoes), and garment flat sketches, all scattered freely and connected by thin blue diagonal lines suggesting AI-generated relationships. Some cards show \"已生成\" status badges. A floating right panel shows \"AI 助理\" with a text prompt input area. The UI chrome shows the Fasium logo top-left, \"画板\" sidebar navigation. The whole canvas scene is placed inside a dark #0a0a0a marketing frame with slight perspective tilt (2-3 degree rotation) to give a dynamic feel. Orange accent on one active node. Figma/Miro-inspired infinite canvas aesthetic, depth of field on edges, high-detail fashion tech SaaS visual, 16:9 landscape. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "快速试穿你的服装",
    subtitle: "下单前看到真实成衣",
    description: "将设计方案实时渲染到虚拟模特上，多角度查看成衣效果。无需打样、无需等待，在屏幕上就能看到设计落在真实比例人台上的样子，大幅减少试错打样成本。",
    bullets: [
      "花型 + 版型实时渲染到模特",
      "支持多角度旋转查看",
      "一键切换面料质感和光影效果"
    ],
    image: "/feat-4-tryon.png", // <--- 在这里替换第四张图片的路径
    prompt: "A clean product UI screenshot for a virtual fashion try-on AI feature on a dotted grid canvas. On the left: a studio product photo of a blue floral midi dress, labeled \"试穿-改图\". On the right: a tall phone-frame UI mockup (iOS-style rounded rectangle outline) showing the try-on result — the same floral dress rendered realistically on a female model inside the phone frame, slightly blurred/fading-in with 3 blue loading dots at center suggesting real-time AI rendering. At top of phone frame: small avatar and brief title bar. The two elements are connected by a thin blue diagonal line. The canvas has a light gray dotted background. The entire scene is set inside a dark #0a0a0a marketing card with soft orange highlight on the loading animation dots. Ultra-clean UI mockup aesthetic, photorealistic garment rendering inside the phone frame, fashion AI product marketing image, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "快速获得你的三视图",
    subtitle: "一键生成标准技术款式图",
    description: "从设计概念图自动生成正面、背面、侧面的标准技术款式图，符合行业规范，可直接用于 Tech Pack 制作和工厂沟通，省去手动绘制的繁琐工时。",
    bullets: [
      "自动生成正面/背面/侧面三视图",
      "符合服装行业标准线稿规范",
      "可直接导入 Tech Pack 使用"
    ],
    image: "/feat-5-threeview.png", // <--- 在这里替换第五张图片的路径
    prompt: "A sharp product UI screenshot showing a fashion AI three-view generation feature. Left side of canvas: a white rounded UI card labeled \"三视图节点 / 生成正面/侧面/背面视图\" containing a try-on photo of a model in an emerald green A-line dress with \"拖动旋转\" hint and a blue \"生成三视图\" button. Radiating to the right via three blue connecting lines are three separate output cards, each with a bright green \"NEW\" badge: Card 1 (top-right): front-facing view of the green dress on model; Card 2 (middle-right): 45-degree side view; Card 3 (bottom-right): back view showing dress silhouette. Canvas background is light dotted grid. Framed in a dark #0a0a0a marketing border with subtle orange glow on the node card. Clean SaaS UI aesthetic, precise and technical fashion design tool visual, high-fidelity product screenshot style, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "快速获得近似风格的条纹设计",
    subtitle: "参考一款，获得一系列",
    description: "上传参考条纹或图案设计，AI 自动分析其风格基因，生成一系列近似风格的变体设计。无论是经典条纹、几何图案还是抽象纹理，都能快速产出与原设计调性一致的系列化方案。",
    bullets: [
      "智能解析参考图案的风格特征",
      "生成风格一致的系列化图案",
      "支持密度、比例、色彩方向调整"
    ],
    image: "/feat-6-stripe.png", // <--- 在这里替换第六张图片的路径
    prompt: "A detailed product UI screenshot of a stripe pattern extraction and derivation tool for a fashion AI platform. Left side of canvas: a runway fashion photograph of a female model wearing a classic black-and-white horizontal stripe oversized shirt outfit, labeled with a long filename. Center: a white rounded UI panel titled \"条纹提取节点 / 绑定图片后进入条纹提取\" showing the extracted stripe color blocks (dark slate, light gray, beige segments), action buttons \"提取条纹\" \"上传图片\" \"更新衍生\" \"保存条纹\", and below it 5 color derivation thumbnails (navy/white, navy/red, navy/beige/tan, solid dark), plus sliders showing Pantone color codes (e.g., \"2380 CP — 144\", \"P 75-1 U — 72\"). Connecting line leads to the right showing a large generated stripe pattern (bold vertical navy and red stripes preview). Canvas on light dotted grid, framed inside dark #0a0a0a marketing border. Orange accent on \"提取条纹\" active button. Technical fashion design tool aesthetic, high-resolution UI screenshot, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "快速生成广告图",
    subtitle: "设计稿直出营销物料",
    description: "将产品设计图一键转化为专业级广告宣传图。自动合成多种场景背景、调整光影效果，无需另请摄影或修图，从设计完成到投放素材，几秒搞定。",
    bullets: [
      "产品图 + 场景背景智能合成",
      "支持多种广告尺寸一键导出",
      "自动优化光影和色彩表现"
    ],
    image: "/feat-7-ad.png", // <--- 在这里替换第七张图片的路径
    prompt: "A stunning product UI screenshot showing AI-powered fashion advertising image generation. Left: a white rounded UI panel titled \"广告图生成节点 / 输入一张图，输出 6 张广告图\", showing a fashion product photo of a blue floral bell-sleeve dress as input, two style tags \"ATHLETIC\" (gray) and \"LUXURY\" (selected, red/pink), a red progress bar at 100%, and a blue \"生成\" button. Radiating to the right via blue connecting lines are 6 advertising image outputs arranged in a 2×3 grid on the canvas — each showing the same dress worn by a model in dramatically different scenes: [1] misty forest with golden light, [2] narrow European alleyway, [3] modern city glass building, [4] intimate close-up portrait, [5] dramatic night scene, [6] warm antique library interior. Each image has a white rounded corner and label \"广告图 1\" through \"广告图 6\". Canvas has dotted grid background. Framed inside dark #0a0a0a marketing border. Orange glow on output images. Cinematic quality ad photos inside the mockup, high-fidelity SaaS product marketing visual, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  },
  {
    title: "即刻获得服装打版单",
    subtitle: "确认设计，自动出版单",
    description: "设计方案确认后，系统自动生成完整的标准 Tech Pack，涵盖三视图、线稿标注、配色参数、材料清单等所有生产所需信息，直接发送工厂即可开工，将版单制作从数小时压缩到几分钟。",
    bullets: [
      "自动汇总所有设计参数与材料规格",
      "生成符合行业标准的 Tech Pack",
      "支持导出 PDF / Excel 通用格式"
    ],
    image: "/feat-8-techpack.png", // <--- 在这里替换第八张图片的路径
    prompt: "A precise and professional product UI screenshot of an automated fashion Tech Pack generation feature. Left canvas area: a technical flat sketch/line drawing of a double-breasted blazer (clean fashion illustration style, black lines on white), plus a reference photograph of a model in a wine-red double-breasted blazer with cream wide-leg trousers, labeled \"试穿-改图\". Right side: a tall white scrollable panel titled \"版单报告\" with a \"下载 PDF\" orange button top-right. Panel contains: (1) a product lookbook photo of the red blazer outfit; (2) a \"三视图\" row showing 3 small model photos (front/side/back); (3) a \"线稿标注\" row showing annotated technical drawings with numbered callout lines (1-9); (4) \"基本信息\" section with SKU name, code (FAS-20231027-001), colors (酒红/米白); (5) \"线稿标注（正面）\" structured text with garment construction details; (6) \"材料清单\" table with fabric specs and Pantone references. Canvas and panel sit on light dotted grid. Framed in dark #0a0a0a marketing border with subtle orange accent on the \"下载 PDF\" button. Ultra-clean technical fashion document aesthetic, SaaS product marketing visual, 16:9. Style reference: dark SaaS landing page feature illustration, similar to Linear.app or Vercel marketing screenshots. No watermarks, no text overlays except UI elements."
  }
];

export default function CoreFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <p className="text-[#f97316] text-sm font-bold tracking-widest uppercase mb-4">核心功能</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">全链路秒级落地</h2>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            从素材提取到版单生成，效率提升 100 倍+
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0; // 0-indexed, so 0 is odd in visual (1st), 1 is even (2nd)
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <div className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center`}>
                  
                  {/* Text Content */}
                  <div className={`order-2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-bold mb-6">
                      {feature.subtitle}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{feature.title}</h3>
                    <p className="text-lg text-gray-400 leading-relaxed mb-8">
                      {feature.description}
                    </p>
                    <ul className="space-y-4">
                      {feature.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] shrink-0"></div>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image Content */}
                  <div className={`order-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#141414] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group p-6 md:p-10 flex items-center justify-center">
                      <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
                        <img 
                          src={feature.image || `https://picsum.photos/seed/fasium-feature-${index}/600/380`}
                          alt={feature.title} 
                          className="w-full h-full object-cover scale-[1.03] brightness-[1.05] transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.08]"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                      {/* Subtle overlay removed to make image brighter */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                  
                </div>

                {/* Divider (except for the last item) */}
                {index < features.length - 1 && (
                  <div className="absolute -bottom-12 left-0 right-0 h-[1px] bg-white/5"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
