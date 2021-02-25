import { finder } from '@medv/finder';
import { sendEvent } from './events';
import { getAttributes, getBreadcrumb, getElement } from './util';

let hoverOutline: HTMLElement;
let hoverOutlineLabel: HTMLElement;
let selectOutline: HTMLElement;
let selectOutlineLabel: HTMLElement;
(function createElements() {
  if (typeof window === 'undefined') return;
  hoverOutline = document.querySelector(
    '.ab-designer-hover-outline'
  ) as HTMLElement;
  if (hoverOutline) {
    hoverOutlineLabel = hoverOutline.querySelector('div') as HTMLElement;
  } else {
    // Elements used for the DevTools Inspect mode
    hoverOutline = document.createElement('div');
    hoverOutline.className = 'ab-designer-hover-outline';
    Object.assign(hoverOutline.style, {
      position: 'absolute',
      border: '1px solid #aaaa44',
      zIndex: '999999',
      background: 'rgba(255,255,0,0.2)',
      display: 'none',
      pointerEvents: 'none',
      cursor: 'pointer',
    });
    hoverOutlineLabel = document.createElement('div');
    Object.assign(hoverOutlineLabel.style, {
      position: 'absolute',
      pointerEvents: 'none',
      top: '100%',
      left: '0',
      background: '#333',
      color: '#fff',
      padding: '3px 6px',
      boxSizing: 'border-box',
    });
    hoverOutline.appendChild(hoverOutlineLabel);
    document.body.appendChild(hoverOutline);
  }

  selectOutline = document.querySelector(
    '.ab-designer-select-outline'
  ) as HTMLElement;
  if (selectOutline) {
    selectOutlineLabel = selectOutline.querySelector('div') as HTMLElement;
  } else {
    selectOutline = document.createElement('div');
    selectOutline.className = 'ab-designer-select-outline';
    Object.assign(selectOutline.style, {
      position: 'absolute',
      border: '3px dashed #029dd1',
      backgrond: 'rgba(2,157,209,0.05)',
      zIndex: '999999',
      display: 'none',
      pointerEvents: 'none',
    });
    selectOutlineLabel = document.createElement('div');
    Object.assign(selectOutlineLabel.style, {
      position: 'absolute',
      pointerEvents: 'none',
      top: '100%',
      left: '-3px',
      background: '#029dd1',
      color: '#fff',
      padding: '3px 6px',
      boxSizing: 'border-box',
    });
    selectOutline.appendChild(selectOutlineLabel);
    document.body.appendChild(selectOutline);
  }
})();

function setOutline(
  outlineEl: HTMLElement,
  labelEl: HTMLElement,
  el?: Element,
  label?: string
) {
  if (el) {
    const offsetX = window.pageXOffset;
    const offsetY = window.pageYOffset;

    const box = el.getBoundingClientRect();
    Object.assign(outlineEl.style, {
      display: 'block',
      top: offsetY + box.top - 4 + 'px',
      left: offsetX + box.left - 4 + 'px',
      width: box.width + 8 + 'px',
      height: box.height + 8 + 'px',
    });
    labelEl.textContent = label || '';
  } else {
    outlineEl.style.display = 'none';
  }
}
export function hoverElement(selector: string, ancestor: number = 0) {
  const el = getElement(selector, ancestor);
  setHoverOutline(el || undefined, el ? finder(el) : undefined);
}
export function selectElement(selector: string, ancestor: number = 0) {
  const el = getElement(selector, ancestor);
  if (el) {
    onSelectElement(el);
  }
}
export function onSelectElement(el: Element) {
  const selector = finder(el);
  sendEvent({
    event: 'elementSelected',
    selector,
    display: el.tagName,
    breadcrumb: getBreadcrumb(el),
    innerHTML: el.innerHTML,
    attributes: getAttributes(el),
  });
  stopInspecting();
  setSelectOutline(el, selector);
}
function setHoverOutline(el?: Element, label?: string) {
  setOutline(hoverOutline, hoverOutlineLabel, el, label);
}
function setSelectOutline(el?: Element, label?: string) {
  setOutline(selectOutline, selectOutlineLabel, el, label);
}

let lastEl: Element | null = null;
function onElementHover(e: MouseEvent) {
  const el = e.target as Element;
  if (el === lastEl) return;
  lastEl = el;
  if (!el) {
    sendEvent({
      event: 'elementHover',
      selector: '',
      display: '',
      breadcrumb: [],
    });
    return;
  }
  const selector = finder(el);
  setHoverOutline(el, selector);
  sendEvent({
    event: 'elementHover',
    selector,
    display: el.tagName,
    breadcrumb: getBreadcrumb(el),
  });
}
function onElementClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  if (lastEl) {
    onSelectElement(lastEl);
  }
}

let inspecting = false;
export function startInspecting() {
  if (inspecting) return;
  inspecting = true;
  document.body.addEventListener('mousemove', onElementHover);
  document.body.addEventListener('click', onElementClick);
  document.body.style.cursor = 'pointer';

  lastEl = null;
}
export function stopInspecting() {
  if (!inspecting) return;
  inspecting = false;
  document.body.removeEventListener('mousemove', onElementHover);
  document.body.removeEventListener('click', onElementClick);
  document.body.style.cursor = '';
  setSelectOutline();
  setHoverOutline();
}
