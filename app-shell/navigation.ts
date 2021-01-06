import { createNanoEvents } from "nanoevents";
import { loadAmpShadow, ShadowDoc } from "./ampShadow";
import { fetchDocument } from "./fetchDocument";
import { interceptNavigation } from "./interceptNavigation";

export const events = createNanoEvents();

const init = () => {
  events.emit("init");

  const container = document.getElementById("root")!;

  let currentPage: null | {
    targetUrl: string;
    abort?: () => void;
    doc?: ShadowDoc;
    ready?: boolean;
  } = null;

  const onRouteChange = async (
    url: string,
    { preserve = true }: { preserve?: boolean } = {}
  ) => {
    try {
      if (currentPage && !currentPage?.ready)
        events.emit("pageTransition:aborted", currentPage.targetUrl);

      currentPage?.abort?.();
      currentPage = { targetUrl: url };

      events.emit("pageTransition:started", url);

      // early dispose of the current doc
      if (!preserve) {
        await currentPage?.doc?.close?.();
        if (currentPage?.targetUrl !== url) throw new Error("aborted");
        currentPage.doc = undefined;
        emptyDomElement(container);
      }

      const promise = fetchDocument(url);
      currentPage.abort = promise.abort;

      const [amp, doc] = await Promise.all([loadAmpShadow(), promise]);

      for (const el of doc.querySelectorAll("[data-static-content]"))
        el.parentElement?.removeChild?.(el);

      if (currentPage?.targetUrl !== url) throw new Error("aborted");

      // set title and icon
      {
        const title = doc.querySelector("title");
        if (title) document.title = title.innerText;

        for (const link of doc.querySelectorAll("link")) {
          const query =
            "link" +
            ["type", "rel"]
              .map((name) => {
                const value = link.getAttribute(name);
                return value ? `[${name}="${value}"]` : "";
              })
              .join("");

          document
            .querySelector(query)
            ?.setAttribute?.("href", link.getAttribute("href")!);
        }
      }

      // dispose of the current doc
      await currentPage?.doc?.close?.();
      if (currentPage?.targetUrl !== url) throw new Error("aborted");
      currentPage.doc = undefined;
      emptyDomElement(container);

      const wrapper = document.createElement("div");
      container.appendChild(wrapper);

      currentPage.doc = amp.attachShadowDoc(wrapper, doc, url);

      await currentPage.doc.ampdoc.whenReady();

      if (currentPage?.targetUrl !== url) throw new Error("aborted");

      currentPage.ready = true;

      events.emit("pageTransition:ended", url);
    } catch (err) {
      // swallow aborted errors
      if (err.message === "aborted" || err.message === "Request aborted")
        return;

      console.error(err);

      const errorPage = document.createElement("div");
      errorPage.style.padding = "50px 10px";
      emptyDomElement(container);
      container.appendChild(errorPage);

      switch (err.message) {
        case "Network failure":
        case "Network Error":
          errorPage.innerHTML =
            "<h1>⛔️ Error</h1><span>⚡ It seems like you are offline</span>";
          break;

        default:
          errorPage.innerHTML =
            "<h1>⛔️ Error</h1><span>😐 Something unexpectedly wrong happened";

          break;
      }

      events.emit("pageTransition:error", url);
    }
  };

  interceptNavigation(document.body, (url, anchorElement) => {
    events.emit("navigate", url, anchorElement);
    window.history.pushState({}, undefined as any, url);
    onRouteChange(url);
  });

  window.addEventListener("popstate", () => {
    const url =
      window.location.pathname + window.location.search + window.location.hash;

    onRouteChange(url);
  });

  {
    const url =
      window.location.pathname + window.location.search + window.location.hash;

    onRouteChange(url);
  }
};

const emptyDomElement = (container?: HTMLElement) => {
  while (container?.children?.[0]) container.removeChild(container.children[0]);
};

if (document.body) init();
else window.addEventListener("load", init);
