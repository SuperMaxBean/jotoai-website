'use client';

import { useEffect } from 'react';
import { buildTrafficSource, saveTrafficSource } from '@/services/traffic-source';

/**
 * 不可见组件：页面首次加载时捕获流量来源数据
 * 放置在 layout 中确保任何落地页都能捕获
 */
export default function TrafficSourceCapture() {
  useEffect(() => {
    const trafficSource = buildTrafficSource(
      window.location.search,
      document.referrer
    );
    saveTrafficSource(trafficSource);
  }, []);

  return null;
}
