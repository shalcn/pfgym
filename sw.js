const VERSION = 'pfgym-v1';
const CORE = [
  '/', '/pfgym', '/index.html',
  '/styles.css', '/app.js', '/firebase.js', '/pfgymlogo.png', '/hero_03_16x9.jpg'
];
const ROUTES = {
  '/': '/index.html',
  '/pfgym': '/index.html',
  '/index-en': '/index-en.html',
  '/about': '/about.html',
  '/bmi': '/bmi.html',
  '/member': '/member.html',
  '/testimoni': '/testimoni.html',
  '/privacy': '/privacy.html',
  '/feedback': '/feedback.html',
  '/login': '/login.html',
  '/admin': '/admin.html',
  '/auth-edit': '/auth-edit.html',
  '/about-en': '/about-en.html',
  '/bmi-en': '/bmi-en.html',
  '/member-en': '/member-en.html',
  '/testimoni-en': '/testimoni-en.html',
  '/privacy-en': '/privacy-en.html',
  '/feedback-en': '/feedback-en.html'
  ,'/lokasi-condongcatur': '/lokasi-condongcatur.html'
  ,'/lokasi-kasihan': '/lokasi-kasihan.html'
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Navigation routing to extensionless paths
  if (req.mode === 'navigate') {
    const path = url.pathname.replace(/\/$/, '') || '/';
    const mapped = ROUTES[path];
    if (mapped) {
      event.respondWith(fetch(mapped).catch(() => caches.match(mapped)));
      return;
    }
  }
  // Cache-first for static assets
  if (req.method === 'GET' && (req.destination === 'style' || req.destination === 'script' || req.destination === 'image')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }))
    );
  }
});
