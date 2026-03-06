// lib/tiktok.ts
declare global {
  interface Window {
    ttq?: any;
  }
}

const TIKTOK_SRC = "https://analytics.tiktok.com/i18n/pixel/events.js";

let loadPromise: Promise<void> | null = null;

function hasTtq() {
  return typeof window !== "undefined" && typeof window.ttq !== "undefined";
}

export function loadTikTokPixel(pixelId: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!pixelId) return Promise.resolve();
  if (hasTtq()) return Promise.resolve();

  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve) => {
    // cria stub/queue do ttq antes do script carregar
    (function (w: any, d: Document, t: string) {
      w.TiktokAnalyticsObject = t;
      const ttq = (w[t] = w[t] || []);
      ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
      ];
      ttq.setAndDefer = function (t: any, e: string) {
        t[e] = function () {
          t.push([e].concat([].slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = function (t: any) {
        const e = ttq._i[t] || [];
        for (let n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      ttq.load = function (e: string) {
        const n = d.createElement("script");
        n.type = "text/javascript";
        n.async = true;
        n.src = `${TIKTOK_SRC}?sdkid=${encodeURIComponent(e)}&lib=${t}`;
        const s = d.getElementsByTagName("script")[0];
        s?.parentNode?.insertBefore(n, s);
      };
      ttq._i = {};
      ttq._t = ttq._t || {};
      ttq._o = ttq._o || {};
      ttq._partner = ttq._partner || "vercel_nextjs";
      ttq._q = ttq._q || [];
    })(window, document, "ttq");

    window.ttq.load(pixelId);
    window.ttq.page();

    // espera “um pouco” o script real assumir; se não, resolve mesmo assim (queue funciona)
    const start = Date.now();
    const tick = () => {
      if (hasTtq()) return resolve();
      if (Date.now() - start > 4000) return resolve();
      setTimeout(tick, 50);
    };
    tick();
  });

  return loadPromise;
}

export function trackTikTok(event: string, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (!window.ttq) return;
  window.ttq.track(event, payload);
}

export function newEventId(prefix: string) {
  // simples e suficiente pra dedup
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function unixTimeNow() {
  return Math.floor(Date.now() / 1000);
}
