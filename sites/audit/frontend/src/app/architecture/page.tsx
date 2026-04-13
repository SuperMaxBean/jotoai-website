export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Architecture from '../../views/Architecture';
export const metadata: Metadata = { title: '技术架构 - 唯客智审' };
export default function Page() { return <Architecture />; }
