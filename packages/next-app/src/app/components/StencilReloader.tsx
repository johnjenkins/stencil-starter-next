'use client';

import { useEffect } from 'react';

// Reload page when stencil packages are recompiled (for local dev with linked packages)

export function StencilReloader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Skip if we just reloaded (prevent infinite loops)
    const RELOAD_KEY = 'stencil-reload-time';
    const lastReload = sessionStorage.getItem(RELOAD_KEY);
    const now = Date.now();
    if (lastReload && now - parseInt(lastReload, 10) < 2000) {
      return;
    }

    let currentHash: string | null = null;

    // Hook into Next.js HMR WebSocket (use wss:// for HTTPS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/_next/webpack-hmr`);

    ws.onmessage = (event) => {
      try {
        const messages = event.data.split('\n').filter(Boolean);
        for (const msg of messages) {
          const data = JSON.parse(msg);

          // Only reload on actual rebuilds with a new hash
          if (data.action === 'built' && data.hash) {
            if (currentHash === null) {
              // First message, just store the hash
              currentHash = data.hash;
            } else if (data.hash !== currentHash) {
              // Hash changed = real rebuild happened
              currentHash = data.hash;
              sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
              window.location.reload();
            }
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
