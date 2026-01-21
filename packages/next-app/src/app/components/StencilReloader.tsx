"use client";

import { useEffect } from "react";

// Full page reload when linked stencil packages change
// Only reloads if Fast Refresh can't handle the update (external packages)

const HASH_KEY = "stencil-last-hash";

export function StencilReloader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/_next/webpack-hmr`
    );

    let pendingHash: string | null = null;

    ws.onmessage = (event) => {
      try {
        const messages = event.data.split("\n").filter(Boolean);
        for (const msg of messages) {
          const data = JSON.parse(msg);

          // Store hash when build completes
          if (data.action === "built" && data.hash) {
            const lastHash = sessionStorage.getItem(HASH_KEY);
            if (lastHash && lastHash !== data.hash) {
              // New build - wait to see if Fast Refresh handles it
              pendingHash = data.hash;
              // Give Fast Refresh 500ms to apply the update
              setTimeout(() => {
                if (pendingHash) {
                  sessionStorage.setItem(HASH_KEY, pendingHash);
                  window.location.reload();
                }
              }, 500);
            } else {
              sessionStorage.setItem(HASH_KEY, data.hash);
            }
          }

          // Fast Refresh succeeded - cancel pending reload
          if (data.event === "client-success" || data.action === "sync") {
            pendingHash = null;
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
