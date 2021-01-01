export type Box = { x: number; y: number; width: number; height: number };

export const applyBoxTransform = (
  element: HTMLElement,
  { x, y, width, height }: Box
) => {
  element.style.transform = `translate(${x}px,${y}px)`;
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
};

export const getImage = (element: HTMLElement | null) =>
  element?.tagName === "IMG"
    ? (element as HTMLImageElement)
    : element?.querySelector("img");

export const documentsQuerySelector = (query: string) => {
  const shadowRoots = Array.from(document.getElementsByTagName("*"))
    .map((el) => el.shadowRoot)
    .filter(Boolean) as ShadowRoot[];

  const documents = [document, ...shadowRoots];

  return documents.reduce(
    (el, doc) => el || doc.querySelector(query),
    null as null | HTMLElement
  );
};

/**
 * return the bounding box of the element,
 * relative to the top left corner of the whole page
 * ( it works here because the only scollable container is the document )
 */
export const getAbsoluteBoundingBox = (element: Element) => {
  const r = element.getBoundingClientRect();
  const box = { x: r.x, y: r.y, width: r.width, height: r.height };

  if (document.scrollingElement) {
    box.y += document.scrollingElement.scrollTop;
    box.x += document.scrollingElement.scrollLeft;
  }

  return box;
};

export const wait = (delay = 0) => new Promise((r) => setTimeout(r, delay));

export const waitForAmpImage = async (ampImage: HTMLElement) => {
  let i = getImage(ampImage);

  while (!(i = getImage(ampImage))) await wait(30);

  if (i.naturalWidth) return i;

  return new Promise((r) => i!.addEventListener("load", r));
};

// from https://stackoverflow.com/questions/5573096/detecting-webp-support
export const supportWebP = document
  .createElement("canvas")
  .toDataURL("image/webp")
  .includes("data:image/webp");

export const getAmpImageSource = (ampImage: HTMLElement) => {
  const sources = [
    ampImage?.getAttribute?.("src"),
    ...[...ampImage.querySelectorAll("[src]")].map((el: any) =>
      el.getAttribute("src")
    ),
  ].filter(Boolean);

  if (!supportWebP) sources.find((a) => !a.endsWith(".webp"));
  return sources[0];
};
