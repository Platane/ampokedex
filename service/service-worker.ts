import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

/**
 * pre cache
 */
precacheAndRoute(["/app-shell.html", "/app-shell.js"]);

/**
 * upon navigation, serve the pwa shell instead
 */
const handler = createHandlerBoundToURL("/app-shell.html");
registerRoute(({ event }) => event.request.mode === "navigate", handler);

/**
 * cache pages
 */
registerRoute(
  ({ url }) => url.pathname.match(/^(\/pokemon\/[^/]+|\/type\/[^/]+|\/)$/),

  new CacheFirst({
    cacheName: "content-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 100 * 24 * 60 * 60,
        maxEntries: 100,
      }),
    ],
  })
);

/**
 * cache images
 */
//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png
registerRoute(
  ({ url }) => {
    console.log(url);
    return false;
  },

  new CacheFirst({
    cacheName: "content-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 100 * 24 * 60 * 60,
        maxEntries: 300,
      }),
    ],
  })
);

export {};
