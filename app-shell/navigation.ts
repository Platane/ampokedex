import { createNanoEvents } from "nanoevents";
import { loadAmpShadow, ShadowDoc } from "./ampShadow";
import { fetchDocument } from "./fetchDocument";
import { interceptNavigation } from "./interceptNavigation";

const container = document.createElement("div");
document.body.appendChild(container);

export const events = createNanoEvents();

{
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

      if (currentPage?.targetUrl !== url) throw new Error("aborted");

      // set title and icon
      {
        const title = doc.querySelector("title");
        if (title) document.title = title.innerText;

        const icon = doc.querySelector('link[rel="icon"]');
        if (icon)
          document
            .querySelector('link[rel="icon"]')
            ?.setAttribute("href", icon.getAttribute("href") || "");
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
      throw err;
    }
  };

  interceptNavigation(container, (url, anchorElement) => {
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
}

const emptyDomElement = (container?: HTMLElement) => {
  while (container?.children?.[0]) container.removeChild(container.children[0]);
};