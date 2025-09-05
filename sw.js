const CACHE_NAME = 'industrial-mercedes-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/contacto.html',
  '/styles.css',
  '/script.js',
  '/favicon.ico',
  '/manifest.json',
  // Agrega aquí las rutas de tus imágenes más importantes
  '/img/sobre-nosotros.webp',
  '/img/mesa-comedor.webp',
  '/img/mesa-de-centro.webp',
  '/img/estanteria-modular.webp',
  '/img/destacado.jpg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error al agregar archivos al cache:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptación de solicitudes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve el recurso desde el cache si existe
        if (response) {
          return response;
        }
        // Si no está en cache, lo solicitamos a la red
        return fetch(event.request).then(
          (response) => {
            // Verificamos si obtenemos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANTE: Clonamos la respuesta porque puede ser consumida solo una vez
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});