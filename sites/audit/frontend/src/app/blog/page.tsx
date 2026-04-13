export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Blog from '../../views/Blog';
export const metadata: Metadata = { title: '新闻博客 - 唯客智审' };
export default function Page() { return <Blog />; }
