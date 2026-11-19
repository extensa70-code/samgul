// 오프라인 캐시 (버전 202611191708) — 하위 게임 폴더(civ/ fist/ volley/)는 건드리지 않음
const CACHE = 'sgjp-202611191708';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
const SUB = /\/(civ|fist|volley)\//;
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => { if (k.startsWith('sgjp-') && k !== CACHE) return caches.delete(k); return caches.open(k).then(c => c.keys().then(rs => Promise.all(rs.map(r => c.match(r).then(m => (m && !m.ok) ? c.delete(r) : 0))))); }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || SUB.test(new URL(e.request.url).pathname)) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true })).then(hit => hit || fetch(e.request).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; }).catch(() => caches.match('./index.html'))));
});
