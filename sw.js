const CACHE_NAME = 'achadinhos-v6'; // Mudei para v5 para forçar a atualização
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Instala o motor no navegador e força a instalação imediata
self.addEventListener('install', event => {
  self.skipWaiting(); // Obriga o app novo a assumir o controle na hora
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assets);
      })
  );
});

// NOVO: Essa função é a "faxineira". Ela apaga qualquer cache velho do app antigo!
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando versão antiga do aplicativo...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma o controle da tela imediatamente
  );
});

// Serve os arquivos do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
