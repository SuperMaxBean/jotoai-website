'use client';

import dynamic from 'next/dynamic';

const BlogPostPage = dynamic(() => import('../../../views/BlogPostPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Page() {
  return <BlogPostPage />;
}
