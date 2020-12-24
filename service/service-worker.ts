import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

/**
 * pre cache
 */
precacheAndRoute([
  "/app-shell.html",
  "/app-shell.js",
  "https://cdn.ampproject.org/shadow-v0.js",
]);

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
        maxEntries: 100,
      }),
    ],
  })
);

/**
 * cache images
 */
registerRoute(
  ({ url: { href }, request }) =>
    request.destination === "image" &&
    href.startsWith(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites"
    ),

  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

export {};
