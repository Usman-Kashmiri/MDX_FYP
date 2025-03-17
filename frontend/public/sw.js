importScripts("https://js.pusher.com/beams/service-worker.js");
const CACHE_NAME = 'nbundle_cache';
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                'static/js/bundle.js'
            ])
                .then(() => self.skipWaiting())
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})