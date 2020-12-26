import { createNanoEvents } from "nanoevents";
import { loadAmpShadow, ShadowDoc } from "./ampShadow";
import { fetchDocument } from "./fetchDocument";
import { interceptNavigation } from "./interceptNavigation";

const container = document.createElement("div");
document.body.appendChild(container);

const ee = createNanoEvents();

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
        ee.emit("pageTransition:aborted", currentPage.targetUrl);

      currentPage?.abort?.();
      currentPage = { targetUrl: url };

      ee.emit("pageTransition:started", url);

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

      ee.emit("pageTransition:ended", url);
    } catch (err) {
      // swallow aborted errors
      if (err.message === "aborted" || err.message === "Request aborted")
        return;
      throw err;
    }
  };

  interceptNavigation(container, (url: string) => {
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

{
  const topProgressBar = document.createElement("div");
  topProgressBar.style.opacity = "0";
  topProgressBar.style.left = "0";
  topProgressBar.style.top = "0";
  topProgressBar.style.height = "4px";
  topProgressBar.style.backgroundColor = "orange";
  topProgressBar.style.position = "fixed";
  topProgressBar.style.pointerEvents = "none";
  document.body.appendChild(topProgressBar);

  let onTransitionEnd = () => undefined as void;

  ee.on("pageTransition:started", () => {
    topProgressBar.style.width = "0";
    topProgressBar.style.opacity = "0";
    topProgressBar.style.transition = "";
    topProgressBar.removeEventListener("transitionend", onTransitionEnd);

    topProgressBar.getBoundingClientRect();
    topProgressBar.style.transition =
      "opacity 120ms ease-out 200ms, width 900ms ease-out 200ms";
    topProgressBar.style.width = (Math.random() * 0.4 + 0.5) * 100 + "%";
    topProgressBar.style.opacity = "1";
  });

  const end = () => {
    topProgressBar.removeEventListener("transitionend", onTransitionEnd);

    topProgressBar.style.transition =
      "opacity 120ms ease-out 200ms, width 120ms linear";
    topProgressBar.style.width = "100%";

    onTransitionEnd = () => {
      topProgressBar.removeEventListener("transitionend", onTransitionEnd);
      topProgressBar.style.opacity = "0";
      topProgressBar.style.transition = "opacity 120ms ease-out";
    };
    topProgressBar.addEventListener("transitionend", onTransitionEnd);
  };
  ee.on("pageTransition:ended", end);
  ee.on("pageTransition:aborted", end);
}

const emptyDomElement = (container?: HTMLElement) => {
  while (container?.children?.[0]) container.removeChild(container.children[0]);
};
