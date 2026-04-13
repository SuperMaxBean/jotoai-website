import React from 'react';

const Footer = () => (
  <footer className="bg-[#050B14] text-gray-400 py-16 border-t border-white/5">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
      <div className="flex flex-col">
        <div className="h-14 flex flex-col justify-start mb-4">
            <h3 className="text-white text-lg font-bold leading-none">唯客 AI 护栏</h3>
            <p className="text-xs text-gray-500 mt-2">JOTO.AI 旗下产品</p>
        </div>
        <div className="space-y-2">
          <p>中国首家 Dify 官方服务商</p>
          <p>jotoai@jototech.cn</p>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">产品文档</h4>
        <ul className="space-y-2">
          <li><a href="/features" className="hover:text-brand-blue text-left">产品功能</a></li>
          <li><a href="/changelog" className="hover:text-brand-blue text-left">更新日志</a></li>
          <li><a href="/roadmap" className="hover:text-brand-blue text-left">技术路线图</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">产品目录</h4>
        <ul className="space-y-2">
          <li><a href="https://shanyue.jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">闪阅</a></li>
          <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">Dify</a></li>
          <li><a href="/" className="hover:text-brand-blue text-white font-medium text-left">AI 安全</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">关于我们</h4>
        <ul className="space-y-2">
          <li><a href="/about" className="hover:text-brand-blue">关于 JOTO.AI</a></li>
          <li><a href="https://www.jotoai.com/?page_id=9069" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">合作伙伴</a></li>
          <li><a href="https://www.jotoai.com/?page_id=9968" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">加入我们</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
      上海聚托信息科技有限公司©2026 沪ICP备15056478号-5
    </div>
  </footer>
);

export default Footer;
