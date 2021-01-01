import { events } from "./navigation";

{
  const topProgressBar = document.createElement("div");
  topProgressBar.style.opacity = "0";
  topProgressBar.style.left = "0";
  topProgressBar.style.top = "0";
  topProgressBar.style.height = "4px";
  topProgressBar.style.backgroundColor = "orange";
  topProgressBar.style.position = "fixed";
  topProgressBar.style.pointerEvents = "none";

  let onTransitionEnd = () => undefined as void;

  events.on("pageTransition:started", () => {
    document.body.appendChild(topProgressBar);

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
  events.on("pageTransition:ended", end);
  events.on("pageTransition:aborted", end);
  events.on("pageTransition:error", end);
}
