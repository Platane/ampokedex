// intercept click on anchor
export const interceptNavigation = (
  container: HTMLElement,
  onNavigate?: (href: string, a: HTMLAnchorElement) => void
) => {
  const onClick = (event: any) => {
    if (event.ctrlKey || event.shiftKey) return;

    if (event.defaultPrevented) return;

    const target =
      event.path?.[0] ?? event.explicitOriginalTarget ?? event.target;
    const a = getAncestorLink(target);

    if (a?.href) {
      const { origin, pathname, search, hash } = new URL(
        a.href,
        window.location.origin
      );
      const href = pathname + search + hash;

      if (origin === window.location.origin) {
        event.preventDefault();
        onNavigate?.(href, a);
      }
    }
  };
  container.addEventListener("click", onClick);

  return () => container.removeEventListener("click", onClick);
};

const getAncestorLink = (
  el: HTMLElement | null,
  container?: HTMLElement
): HTMLAnchorElement | undefined => {
  if (!el || el === container) return;

  if (el.tagName === "A") return el as HTMLAnchorElement;

  return getAncestorLink(el.parentElement, container);
};
