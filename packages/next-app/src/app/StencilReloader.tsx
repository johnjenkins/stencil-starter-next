'use client';

import { useEffect } from 'react';

// just a nicety for this repro - intercept compilation events and hard-reload the page

export function StencilReloader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let lastBuildTime = Date.now();

    const handleReload = () => {
      const now = Date.now();
      if (now - lastBuildTime > 500) {
        lastBuildTime = now;
        window.location.reload();
      }
    };

    // Hook into Next.js HMR WebSocket
    const ws = new WebSocket(`ws://${window.location.host}/_next/webpack-hmr`);

    ws.onmessage = (event) => {
      try {
        // Next.js sends newline-delimited JSON
        const messages = event.data.split('\n').filter(Boolean);
        for (const msg of messages) {
          const data = JSON.parse(msg);
          if (data.action === 'built' || data.action === 'sync') {
            handleReload();
            break;
          }
        }
      } catch {
        // Ignore parse errors
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return null;
}
