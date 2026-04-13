export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Features from '../../views/Features';
export const metadata: Metadata = { title: '核心功能 - 唯客智审' };
export default function Page() { return <Features />; }
