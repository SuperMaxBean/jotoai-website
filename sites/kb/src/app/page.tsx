export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import LandingPage from '@/src/views/LandingPage';

export default function Home() {
  return (
    <Suspense>
      <LandingPage />
    </Suspense>
  );
}
