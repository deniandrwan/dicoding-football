importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox berhasil dimuat");

  workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/pages/home.html", revision: "1" },
    { url: "/pages/detail.html", revision: "1" },
    { url: "/pages/favorite.html", revision: "1" },
    { url: "/js/api", revision: "1" },
    { url: "/js/db", revision: "1" },
    { url: "/js/idb", revision: "1" },
    { url: "/js/jquery.min.js", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/sw-register.js", revision: "1" },
    { url: "/push.js", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/css/styles.css", revision: "1" },
    { url: "/assets/img/apple-touch-icon.png", revision: "1" },
    { url: "/assets/img/serieA-192", revision: "1" },
    { url: "/assets/img/serieA-512", revision: "1" },
    { url: "/favicon.ico", revision: "1" },
    {
      url: "https://fonts.googleapis.com/icon?family=Material+Icons",
      revision: "1",
    },
    {
      url:
        "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
      revision: "1",
    },
  ]);

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2"),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
    workbox.strategies.cacheFirst({
      cacheName: "images-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    })
  );

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages",
    })
  );
} else {
  console.log("Workbox gagal dimuat");
}

self.addEventListener("notificationClick", function (event) {
  if (!event.action) {
    // Penguna menyentuh area notifikasi diluar action
    event.notification.close();
    console.log("Notification Click.");
    return;
  }
  switch (event.action) {
    case "yes-action":
      console.log("Pengguna memilih action yes.");
      // buka tab baru
      clients.openWindow("./index.html#favorite");
      break;
    case "no-action":
      console.log("Pengguna memilih action no");
      break;
    default:
      console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
      break;
  }
});

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "assets/img/serieA-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
