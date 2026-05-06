// ==UserScript==
// @name         bluesky: strip '.bsky.social' handle suffixes
// @namespace    https://kyu.re/~userscripts
// @version      1.0
// @description  remove the .bsky.social suffix from visible text of profile links
// @author       You
// @match        *://*sky.app/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const PROFILE_LINK_SELECTOR = 'a[href^="/profile/"]';

  const HOST_RE = /\.bsky\.social/;
  const SUFFIX_RE = HOST_RE;

  const removeSuffix = (str) => str.replace(SUFFIX_RE, "");

  const sanitizeTextNode = (node) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    if (HOST_RE.test(node.nodeValue)) {
      node.nodeValue = removeSuffix(node.nodeValue);
    }
  };

  const sanitizeAriaLabel = (el) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    const label = el.getAttribute && el.getAttribute("aria-label");
    if (label && HOST_RE.test(label)) {
      el.setAttribute("aria-label", removeSuffix(label));
    }
  };

  const sanitizeSubtree = (root) => {
    if (!root) return;
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (node.nodeType === Node.TEXT_NODE) {
        sanitizeTextNode(node);
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.hasAttribute && node.hasAttribute("aria-label")) {
        sanitizeAriaLabel(node);
      }
      if (node.children.length === 0) {
        if (node.textContent && HOST_RE.test(node.textContent)) {
          node.textContent = removeSuffix(node.textContent);
        }
        continue;
      }
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        stack.push(node.childNodes[i]);
      }
    }
  };

  const main = () => {
    document.querySelectorAll(PROFILE_LINK_SELECTOR).forEach(sanitizeSubtree);
    document.querySelectorAll("[aria-label]").forEach(sanitizeAriaLabel);
  };

  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === "childList" && m.addedNodes.length) {
        m.addedNodes.forEach((node) => sanitizeSubtree(node));
      } else if (m.type === "characterData") {
        sanitizeTextNode(m.target);
      } else if (m.type === "attributes" && m.attributeName === "aria-label") {
        sanitizeAriaLabel(m.target);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label"],
  });

  main();
})();
