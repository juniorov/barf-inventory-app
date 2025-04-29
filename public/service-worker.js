const CACHE_NAME = 'barf-inventory-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js', // El bundle de tu aplicación
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Agrega aquí cualquier otro asset importante (CSS, imágenes, etc.)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto, agregando archivos');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Devuelve la respuesta del caché si está disponible
        }
        return fetch(event.request); // Si no, busca en la red
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Elimina cachés obsoletos
          }
          return null;
        })
      );
    })
  );
});