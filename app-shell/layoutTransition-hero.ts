import { events } from "./navigation";
import {
  applyBoxTransform,
  documentsQuerySelector,
  getAbsoluteBoundingBox,
} from "./utils";

const duration = 260;

{
  const floatingContainer = document.createElement("div");
  floatingContainer.id = "hero-transition-container";
  floatingContainer.style.position = "absolute";
  floatingContainer.style.top = "0";
  floatingContainer.style.left = "0";
  floatingContainer.style.pointerEvents = "none";
  floatingContainer.style.overflow = "hidden";
  floatingContainer.style.transition = `background-color ${duration}ms`;

  const [img1, img2] = [1, 1].map((_, i) => {
    const img = document.createElement("img");
    img.id = "hero-transition-" + i;
    img.style.imageRendering = "pixelated";
    img.style.objectFit = "contain";
    img.style.objectPosition = "center";
    img.style.position = "absolute";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.left = "0";
    img.style.top = "0";
    floatingContainer.appendChild(img);
    return img;
  });

  let onLoad1 = () => undefined as void;
  let onLoad2 = () => undefined as void;

  const cancel = () => {
    currentUrl = "";

    img1.style.opacity = "0";
    img1.removeEventListener("load", onLoad1);
    img1.getAnimations().forEach((a) => a.cancel());

    img2.style.opacity = "0";
    img2.removeEventListener("load", onLoad2);
    img2.getAnimations().forEach((a) => a.cancel());

    if (floatingContainer.parentElement)
      floatingContainer.parentElement.removeChild(floatingContainer);
  };

  let currentUrl = "";

  events.on("pageTransition:started", (url: string) => {
    cancel();

    const target = documentsQuerySelector("[data-layout-target]");

    if (target && url.startsWith("/pokemon/")) {
      const box = getAbsoluteBoundingBox(target);
      applyBoxTransform(floatingContainer, box);

      img1.src = target.getAttribute("src")!;

      floatingContainer.style.backgroundColor = target.style.backgroundColor;

      currentUrl = url;

      onLoad1 = () => {
        if (currentUrl !== url) return;

        document.body.appendChild(floatingContainer);

        const h = 500;

        img1.style.opacity = "1";
        img1.style.transform = `translate(${h}px,${h}px) rotate(80deg)`;
        img1.animate(
          [
            { transform: "translate(0,0)" },
            { transform: `translate(${h}px,${h}px) rotate(80deg)` },
          ],
          duration
        );
      };

      if (img1.naturalWidth) onLoad1();
      else img1.addEventListener("load", onLoad1);
    }
  });

  events.on("pageTransition:ended", async (url: string) => {
    if (currentUrl !== url) return;

    const target = documentsQuerySelector("[data-layout-target]");

    if (target) {
      img2.src = target.getAttribute("src")!;

      floatingContainer.style.backgroundColor = target.style.backgroundColor;

      onLoad2 = () => {
        if (currentUrl !== url) return;

        const h = 500;

        img2.style.opacity = "1";
        img2
          .animate(
            [
              { transform: `translateX(${-h}px)`, offset: 0 },
              {
                transform: `translateX(${h * 0.1}px) rotate(10deg)`,
                offset: 0.6,
              },
              {
                transform: `translateX(${h * 0.04}px) scale(1.12)`,
                offset: 0.7,
              },
              {
                transform: `translateX(${0}px) scale(0.92)`,
                offset: 0.9,
              },
              { transform: `translateX(0px) scale(1)`, offset: 1 },
            ],
            duration
          )
          .addEventListener("finish", cancel);
      };

      if (img2.naturalWidth) onLoad2();
      else img2.addEventListener("load", onLoad2);
    }
  });

  events.on("pageTransition:aborted", cancel);
  events.on("pageTransition:error", cancel);
}
