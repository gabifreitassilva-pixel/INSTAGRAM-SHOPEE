const CACHE_NAME = 'achadinhos-v7';

// Lista de arquivos vitais que o celular vai baixar
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Instalação agressiva (força a entrada)
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Limpeza de vestígios antigos (apaga o cache quebrado)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando versão antiga do App...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});

// 3. Garante que vai funcionar offline depois
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
