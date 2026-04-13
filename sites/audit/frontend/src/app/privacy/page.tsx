export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Privacy from '../../views/Privacy';
export const metadata: Metadata = { title: '隐私政策 - 唯客智审' };
export default function Page() { return <Privacy />; }
