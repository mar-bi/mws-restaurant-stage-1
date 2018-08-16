const appPrefix = 'rest-rev-app';
const staticCacheVersion = 'v1';
const mapsCacheVersion = 'v1';
const imgCahcheVersion = 'v1';
const staticCacheName = `${appPrefix}-static-${staticCacheVersion}`;
const contentMapCache = `${appPrefix}-maps-${mapsCacheVersion}`;
const contentImagesCache = `${appPrefix}-imgs-${imgCahcheVersion}`;
const allCaches = [staticCacheName, contentMapCache, contentImagesCache];

const repoPrefix = '/mws-restaurant-stage-1/';
const URLS = [
  `${repoPrefix}index.html`,
  `${repoPrefix}restaurant.html`,
  `${repoPrefix}js/main.js`,
  `${repoPrefix}js/dbhelper.js`,
  `${repoPrefix}js/restaurant_info.js`,
  `${repoPrefix}css/build/styles.css`,
  `${repoPrefix}data/restaurants.json`,
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
];

/**
 * Cache static assets(html, css, js)
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(URLS);
    })
  );
});

/**
 * Delete old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith(appPrefix) &&
              !allCaches.includes(cacheName)
            );
          })
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

/**
 * Cache maps and images
 */
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  //cache map tiles and markers
  if (requestUrl.origin.startsWith('https://api.tiles.mapbox.com') ||
		requestUrl.pathname.startsWith('/leaflet@1.3.1/dist/images/')) {
    event.respondWith(serveImgAssets(contentMapCache, event.request));
    return;
  }

  //cache images
  if (requestUrl.origin === location.origin &&
		requestUrl.pathname.startsWith('/build_images/')) {
    event.respondWith(serveImgAssets(contentImagesCache, event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


function serveImgAssets(cacheName, eventRequest){
  return caches.open(cacheName).then(function(cache) {
    return cache.match(eventRequest).then(function(response) {
      return response || fetch(eventRequest).then(function(response) {
        console.log('putting to cache', cacheName);
        cache.put(eventRequest, response.clone());
        return response;
      });
    });
  });
}