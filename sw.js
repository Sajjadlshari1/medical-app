const CACHE_NAME = "medical-store-pos-v2";

const APP_FILES = [
"./",
"./index.html"
];

self.addEventListener("install", function (event) {
event.waitUntil(
caches.open(CACHE_NAME)
.then(function (cache) {
return cache.addAll(APP_FILES);
})
.then(function () {
return self.skipWaiting();
})
);
});

self.addEventListener("activate", function (event) {
event.waitUntil(
self.clients.claim()
);
});

self.addEventListener("fetch", function (event) {
if (event.request.method !== "GET") {
return;
}

const url = new URL(event.request.url);

if (url.origin !== self.location.origin) {
return;
}

event.respondWith(
caches.match(event.request)
.then(function (cached) {
if (cached) {
return cached;
}

    return fetch(event.request)
      .then(function (response) {
        if (!response || !response.ok) {
          return response;
        }

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(function (cache) {
            cache.put(event.request, copy);
          });

        return response;
      })
      .catch(function () {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("Internet connection nahi hai.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      });
  })

);
});
