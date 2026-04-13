
import { 
  Scan, 
  PenTool, 
  BrainCircuit, 
  Mic, 
  School, 
  GraduationCap, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Clock, 
  Scale, 
  FileBarChart, 
  Recycle,
  Layout
} from 'lucide-react';

export const NAV_LINKS = [
  { name: '核心能力', href: '/capabilities' },
  { name: '技术架构', href: '/architecture' },
  { name: '新闻博客', href: '/articles' },
  { name: '联络我们', href: '/contact' },
];

export const VALUE_PROPS = [
  {
    icon: Clock,
    title: '效率低下',
    desc: '一次考试批卷耗时数十小时，大量时间消耗在重复性工作上',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Scale,
    title: '标准不一',
    desc: '不同老师对同一道题的评分存在主观偏差，难以保证评判一致性',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: FileBarChart,
    title: '洞察缺失',
    desc: '批卷结果仅保留分数，缺少对错误类型与知识薄弱点的结构化分析',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Recycle,
    title: '无法复用',
    desc: '每次考试从零配置，试卷模板与批改经验无法沉淀积累',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

export const CASE_STUDIES = [
  {
    company: '瀚海云教育',
    logo: '',
    desc: '全科批卷系统应用，实现了从作业到考试的全流程自动化。现在老师们有更多时间专注于教研，而不是被埋在试卷堆里。'
  },
  {
    company: '尊文智慧教育',
    logo: '',
    desc: '应用范围：全科 + 作文批改。大幅提升了阅卷效率与数据分析能力。特别是英语作文批改，准确率令人惊讶，真的是解放了人力。'
  },
  {
    company: '星火英语教培',
    logo: '',
    desc: '利用专有语言陪练模块，解决了“一对一”口语教学的人力瓶颈。学生们的口语练习频率提高了300%，家长满意度显著上升。'
  }
];

export const FEATURES = [
  {
    tag: 'CORE ARCHITECTURE',
    title: '全题型覆盖',
    desc: '智能路由引擎自动分发任务，实现对纸质作业、PDF、图片及 API 数据的统一处理。全面覆盖选择、填空、计算、证明、作图等全科题型，自动生成结构化教学资产与简洁错题本。',
    image: '',
    align: 'right', // Aligns Image on Left, Text on Right (via flex-row-reverse)
    imageFit: 'contain', // Ensures the diagram is fully visible and not cropped
    icon: Layout
  },
  {
    tag: 'CORE 01',
    title: '自研 OCR 智能试卷识别',
    desc: '识别准确率较GPT-4o提升15%，针对手写公式、理科符号、几何图形深度优化，支持本地部署与API接入。',
    image: '',
    align: 'left',
    icon: Scan
  },
  {
    tag: 'CORE 02',
    title: '智能分步阅卷引擎',
    desc: '逐步读懂解题过程，按步骤给分，自动归类相似错误并智能归因，支持一键针对性重新出题。',
    image: '',
    align: 'right',
    icon: BrainCircuit
  },
  {
    tag: 'CORE 03',
    title: '自动识别题目与答题区域',
    desc: 'AI自动识别试卷中的题目与答题区域，支持大题/小题多层级结构。老师可手动微调，所见即所得，配置一次即可反复批改。',
    image: '',
    align: 'left',
    icon: PenTool
  }
];

export const SCENARIOS = [
  {
    title: '中小学',
    desc: '作业批改 / 单元测试 / 期中期末',
    icon: School,
    bgClass: 'gradient-card-purple',
    pillClass: 'bg-purple-100 text-purple-800'
  },
  {
    title: '高校',
    desc: '公共课阅卷 / 专业课考试 / 选拔赛',
    icon: GraduationCap,
    bgClass: 'gradient-card-blue',
    pillClass: 'bg-blue-100 text-blue-800'
  },
  {
    title: '教培机构',
    desc: '入学分班 / 阶段模拟 / 专项训练',
    icon: Building2,
    bgClass: 'gradient-card-purple',
    pillClass: 'bg-purple-100 text-purple-800'
  },
  {
    title: '教育局',
    desc: '区域联考 / 质量监测 / 数据驾驶舱',
    icon: Landmark,
    bgClass: 'gradient-card-blue',
    pillClass: 'bg-blue-100 text-blue-800'
  }
];

export const ARCHITECTURE = [
  {
    icon: ShieldCheck,
    title: '物理级安全',
    desc: '支持完全本地离线部署，确保数字资产绝对不外泄。',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50'
  },
  {
    icon: Cpu,
    title: '高效推理引擎',
    desc: '基于 ONNX Runtime 的本地模型推理，低延迟，高吞吐。',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    icon: Database,
    title: '数据主权',
    desc: 'SeaORM 驱动的多数据库架构 (MySQL/SQLite)，存储自主可控。',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50'
  },
  {
    icon: BrainCircuit,
    title: '多模式 AI',
    desc: '支持标准答案模式、半监督模式、全自动模式，适应不同考试场景。',
    iconColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-50'
  }
];

export const FAQ_ITEMS = [
  {
    question: "相比 ChatGPT 等通用大模型，闪阅有何独特优势？",
    answer: "通用大模型在教育场景面临四大痛点：\n\n1. 理科识别软肋：在复杂数学公式、化学符号及受力图上易产生“幻觉”；\n2. 隐私合规风险：云端判卷涉及数据上传，面临监管风险；\n3. 成本高昂：软硬一体方案导致升级迭代成本剧增；\n4. 缺乏灵活性：无法针对雅思作文、理科垂类等特定场景进行微调。\n\n闪阅支持本地化部署与专项训练，精准解决上述问题。"
  },
  {
    question: "系统是否支持手写体的中英文混合识别？",
    answer: "支持。闪阅搭载了专为教育场景优化的 OCR 引擎，对于潦草的手写中文、英文以及数字混合书写具有极高的识别准确率，特别针对学生试卷场景进行了大量数据训练。"
  },
  {
    question: "理科公式、几何图形能否被正确识别？",
    answer: "完全可以。这是闪阅的核心优势之一。我们针对数学、物理、化学中的复杂公式、特殊符号（如积分、求和、化学分子式）以及几何图形进行了深度优化，识别准确率远超通用 OCR 模型。"
  },
  {
    question: "数据存储在哪里？是否支持私有化部署？",
    answer: "我们提供多种部署方案。对于对数据安全有极高要求的学校和教育局，我们支持完全的本地私有化部署（On-premise），所有数据存储在您自己的服务器上，无需上传云端，确保数据主权。"
  },
  {
    question: "能否与学校现有的教务系统对接？",
    answer: "支持。我们提供完善的 API 接口文档，可以轻松与学校现有的 LMS（学习管理系统）、教务系统或家校互通平台进行数据打通，实现名单同步与成绩自动回传。"
  },
  {
    question: "如何收费？是否提供试用？",
    answer: "我们提供灵活的报价方案，通常根据使用人数或部署规模进行定制。您可以点击页面上的“申请测试”按钮，我们的解决方案专家会为您开通演示账号，并提供详细的报价咨询。"
  }
];
