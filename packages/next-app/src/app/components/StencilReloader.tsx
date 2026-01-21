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
    if (lastReload && now - parseInt(lastReload, 10) < 3000) {
      return;
    }

    // Wait before listening to avoid initial connection messages
    let ready = false;
    const readyTimeout = setTimeout(() => {
      ready = true;
    }, 1000);

    // Hook into Next.js HMR WebSocket (use wss:// for HTTPS)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/_next/webpack-hmr`);

    ws.onmessage = (event) => {
      if (!ready) return;

      try {
        const messages = event.data.split('\n').filter(Boolean);
        for (const msg of messages) {
          const data = JSON.parse(msg);

          // Next.js wraps HMR data in an "event" field for some message types
          const action = data.action || data.event;

          // Reload on built action (webpack finished compiling)
          if (action === 'built') {
            sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
            window.location.reload();
            return;
          }
        }
      } catch {
        // Ignore parse errors
      }
    };

    return () => {
      clearTimeout(readyTimeout);
      ws.close();
    };
  }, []);

  return null;
}
