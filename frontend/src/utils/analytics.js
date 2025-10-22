// Lightweight GA loader. Loads gtag if VITE_GA_MEASUREMENT_ID is configured.
export function initAnalytics() {
  try {
    const id = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GA_MEASUREMENT_ID) ||
               (typeof process !== 'undefined' && process?.env?.VITE_GA_MEASUREMENT_ID);
    if (!id) return;

    // Avoid duplicate loading
    if (window.__GA_LOADED__) return;

    // Create script tag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);

    window.__GA_LOADED__ = true;
  } catch (e) {
    // no-op
  }
}
