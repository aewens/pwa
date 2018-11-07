var cacheName = "aewens-pwa",
    filesToCache = [
        "index.html", 
        "app.js"
    ];

self.addEventListener("install", function(e) {
    console.log("Installing...");
    e.waitUntil(caches.open(cacheName).then(function(cache) {
        console.log ("Caching...");
        return cache.addAll(filesToCache);
    }));
});

self.addEventListener("activate", function(e) {
    console.log("Activating...");
    e.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(key) {
            if (key !== cacheName) {
                console.log("Removing old cache...");
                return caches.delete(key);
            }
        }));
    }));
    return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
    console.log("Fetching");
    e.respondWith(caches.match(e.request).then(function(res) {
        return res || fetch(e.request);
    }));
});