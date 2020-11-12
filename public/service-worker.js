//select files to cache
const targetCacheFiles = [
  "/",
  "/data.js",
  "/index.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const SITE_CACHE = "site-cache";
const DATA_CACHE = "data-cache";

self.addEventListener("fetch", function (event) {
  //cache all on specified route
  if (event.request.url.includes("/api/")) {
    //set up response
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          //store in cache
          cache.put(event.request.url, response.clone());
          //bring back response
          return response;
        });
      })
    );
    return;
  }

  //set up default response
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else {
          return caches.match("/");
        }
      });
    })
  );
});

//on install of
self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(SITE_CACHE).then(function (cache) {
      return cache.addAll(targetCacheFiles);
    })
  );
});
