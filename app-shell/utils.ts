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
