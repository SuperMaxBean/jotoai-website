export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Contact from '../../views/Contact';
export const metadata: Metadata = { title: '联系我们 - 唯客智审' };
export default function Page() { return <Contact />; }
