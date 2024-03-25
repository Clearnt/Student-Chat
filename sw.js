const staticStudents = "students-site-v1"
const urlsToCache = [
  "/",
  "/index.php",
  "/styles.css",
  "/scripts.js",
  "/add_edit.php",
  "/delete.php",
  "/images/default_pfp.png",
]

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(staticStudents).then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) { return response; }
            const fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(
                function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();

                    caches.open(staticStudents)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                        return response;
                }
            );
        })
    );
});