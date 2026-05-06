// ==UserScript==
// @name         bluesky: swap logo and search
// @namespace    https://kyu.re/~userscripts
// @match        https://*sky.app/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  const OBSERVE_ROOT = document.documentElement;
  const OBSERVE_OPTIONS = { childList: true, subtree: true };

  function findLogoContainer() {
    return document.querySelector('div[style*="padding: 12px 20px 0px"]');
  }

  function findSearchInput() {
    return document.querySelector('input[placeholder="Search"]');
  }

  function hideLogoImage(logoContainer) {
    const img = logoContainer?.querySelector("img");
    if (!img) return false;
    const box = img.closest('div[style*="aspect-ratio"]');
    if (box) box.style.display = "none";
    return true;
  }

  function findSearchRow(searchInput) {
    const relative = searchInput?.closest('div[style*="position: relative"]');
    return relative ? relative.parentElement : null;
  }

  function styleSearchRow(row) {
    if (!row) return;
    row.style.flex = "1";
    row.style.margin = "0";
  }

  function placeSearchIntoCenterSlot(logoContainer, searchRow) {
    const centerSlot = logoContainer?.children?.[1];
    if (!centerSlot || !searchRow) return false;

    centerSlot.innerHTML = "";
    centerSlot.appendChild(searchRow);

    logoContainer?.children?.[0]?.remove();
    centerSlot.style.alignItems = "stretch";
    centerSlot.style.paddingBottom = "4px";

    return true;
  }

  function relocate() {
    const logoContainer = findLogoContainer();
    const searchInput = findSearchInput();
    if (!logoContainer || !searchInput) return false;

    hideLogoImage(logoContainer);

    const searchRow = findSearchRow(searchInput);
    if (!searchRow) return false;

    styleSearchRow(searchRow);

    return placeSearchIntoCenterSlot(logoContainer, searchRow);
  }

  const observer = new MutationObserver(() => {
    if (relocate()) observer.disconnect();
  });
  observer.observe(OBSERVE_ROOT, OBSERVE_OPTIONS);

  if (relocate()) {
    observer.disconnect();
    clearTimeout(timeout);
  }
})();
