// ==UserScript==
// @name         exempt 'force dark mode'
// @namespace    https://kyu.re/~userscripts
// @version      0.2.0
// @description  minimal denylist workaround for chromium's 'force dark mode' flag

// @run-at       document-start
// @allFrames    true
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const META_ID = "fdx-meta-only-light";

  const EXEMPT_HOSTS = [
    "discord.com",
    "kagi.com",
    /\.straw\.page$/i,
    /\.fluxer\.app$/i,
    /\.donmai\.us$/i,
    /\.eu$/i,
    /\.im$/i,
    /^www\.gp-digital\.org$/i,
    /^incyber\.org$/i,
  ];

  const normalizeToPattern = (p) => {
    if (p instanceof RegExp) return p.source;
    if (typeof p !== "string") throw new Error("??? excuse me?");
    if (p.startsWith("/") && p.lastIndexOf("/") > 0) {
      const last = p.lastIndexOf("/");
      return p.slice(1, last);
    }
    return `^${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`;
  };

  const patterns = EXEMPT_HOSTS.map(normalizeToPattern).filter(Boolean).join(
    "|",
  );
  if (!patterns) return;

  const HOST_RE = new RegExp(`(?:${patterns})`, "i");
  if (!HOST_RE.test(location.hostname)) return;

  if (!document.getElementById(META_ID)) {
    const meta = Object.assign(document.createElement("meta"), {
      id: META_ID,
      name: "color-scheme",
      content: "only light",
    });

    const root = document.documentElement || document.head || document;
    (root.prepend || root.appendChild).call(root, meta);
  }
})();
