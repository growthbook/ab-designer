export function getElement(selector: string, ancestor: number): Element | null {
  if (!selector) return null;
  let el: HTMLElement | null = document.querySelector(selector);
  if (!el) return null;

  for (let i = 0; i < ancestor; i++) {
    el = el?.parentElement || null;
    if (!el) return null;
  }

  return el;
}
export function getBreadcrumb(el: Element) {
  const breadcrumb: ElementBreadcrumb = [];
  let current = el.parentElement;
  while (current) {
    breadcrumb.push(current.tagName);
    current = current.parentElement;
  }
  breadcrumb.reverse();
  return breadcrumb;
}
export function getAttributes(el: Element): ElementAttribute[] {
  return el.getAttributeNames().map(name => {
    return {
      name: name,
      value: el.getAttribute(name) || '',
    };
  });
}
