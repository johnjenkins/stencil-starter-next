'use client';

import { useEffect } from 'react';

// Reload page when stencil packages are recompiled (for local dev with linked packages)

const HASH_KEY = 'stencil-last-hash';

export function StencilReloader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Hook into Next.js HMR WebSocket (use wss:// for HTTPS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/_next/webpack-hmr`);

    ws.onmessage = (event) => {
      try {
        const messages = event.data.split('\n').filter(Boolean);
        for (const msg of messages) {
          const data = JSON.parse(msg);

          // Look for built action with a hash
          if (data.action === 'built' && data.hash) {
            const lastHash = sessionStorage.getItem(HASH_KEY);

            if (lastHash && lastHash !== data.hash) {
              // Hash changed - a real rebuild happened, reload
              sessionStorage.setItem(HASH_KEY, data.hash);
              window.location.reload();
              return;
            }

            // Store current hash for comparison
            sessionStorage.setItem(HASH_KEY, data.hash);
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
