import { events } from "./navigation";
import {
  applyBoxTransform,
  documentsQuerySelector,
  Box,
  getAbsoluteBoundingBox,
  waitForAmpImage,
  getAmpImageSource,
} from "./utils";

// when navigating from a page with a pokemon card to a pokemon/xxx page
// copy the card image as floating image and enlarge it to fill the hero image in the pokemon/xxx page
{
  const floatingImage = document.createElement("img");
  floatingImage.id = "list-transition";
  floatingImage.style.position = "absolute";
  floatingImage.style.top = "0";
  floatingImage.style.left = "0";
  floatingImage.style.pointerEvents = "none";
  floatingImage.style.opacity = "0.1";
  floatingImage.style.imageRendering = "pixelated";
  floatingImage.style.objectFit = "contain";
  floatingImage.style.objectPosition = "center";

  let currentTransition: {
    targetUrl: string;
    src: string;
    boxStart: Box;
  } | null = null;

  let onTransitionEnd = () => undefined as void;
  let onLoad = () => undefined as void;
  let onCancel: null | (() => void) = null;

  const cancel = () => {
    onCancel?.();
    onCancel = null;

    floatingImage.removeEventListener("transitionend", onTransitionEnd);
    floatingImage.removeEventListener("load", onLoad);
    currentTransition = null;
    floatingImage.style.opacity = "0.1";
    floatingImage.style.transition = "";

    if (floatingImage.parentElement)
      floatingImage.parentElement.removeChild(floatingImage);
  };

  events.on("navigate", (url: string, anchorElement: HTMLAnchorElement) => {
    cancel();

    const el = anchorElement.querySelector(
      "[data-layout-source]"
    ) as HTMLElement;

    if (el && url.match(/\/pokemon\//)) {
      currentTransition = {
        targetUrl: url,
        boxStart: getAbsoluteBoundingBox(el),
        src: getAmpImageSource(el),
      };
      floatingImage.src = currentTransition.src;
      floatingImage.style.backgroundColor = el.style.backgroundColor;
      document.body.appendChild(floatingImage);
    }
  });

  events.on("pageTransition:started", (url: string) => {
    if (currentTransition?.targetUrl !== url) cancel();
    else applyBoxTransform(floatingImage, currentTransition.boxStart);
  });

  events.on("pageTransition:ended", (url: string) => {
    const target = documentsQuerySelector("[data-layout-target]");

    if (currentTransition?.targetUrl !== url || !target) cancel();
    else {
      const box = getAbsoluteBoundingBox(target);

      onLoad = () => {
        floatingImage.style.opacity = "1";
        floatingImage.style.transition =
          "transform 220ms linear, width 220ms linear, height 220ms linear";
        applyBoxTransform(floatingImage, box);

        target.style.opacity = "0.1";

        onTransitionEnd = async () => {
          await waitForAmpImage(target);

          if (currentTransition?.targetUrl !== url) return;

          cancel();
          target.style.opacity = "1";
        };

        floatingImage.addEventListener("transitionend", onTransitionEnd);

        const c = onCancel;
        onCancel = () => {
          target.style.opacity = "1";
          c?.();
        };
      };

      if (floatingImage.naturalWidth) onLoad();
      else floatingImage.addEventListener("load", onLoad);
    }
  });

  events.on("pageTransition:aborted", cancel);
  events.on("pageTransition:error", cancel);
}
