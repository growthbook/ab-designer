import { finder } from '@medv/finder';
import { sendEvent } from './events';

// Elements used for the DevTools Inspect mode
const elementOutline = document.createElement('div');
Object.assign(elementOutline.style, {
  position: 'absolute',
  border: '1px solid #aaaa44',
  zIndex: '999999',
  background: 'rgba(256,256,0,0.3)',
  display: 'none',
  pointerEvents: 'none',
  cursor: 'pointer',
});
const elementOutlineLabel = document.createElement('div');
Object.assign(elementOutlineLabel.style, {
  position: 'absolute',
  pointerEvents: 'none',
  top: '100%',
  left: '0',
  background: '#333',
  border: '1px solid #aaaa44',
  color: '#fff',
  padding: '3px 6px',
  boxSizing: 'border-box',
});
elementOutline.appendChild(elementOutlineLabel);
document.body.appendChild(elementOutline);

let lastEl: Element | null = null;
export function onElementHover(e: MouseEvent) {
  const el = e.target as Element;
  if (!el || el === lastEl) return;
  lastEl = el;

  const offsetX = window.pageXOffset;
  const offsetY = window.pageYOffset;

  const box = el.getBoundingClientRect();
  Object.assign(elementOutline.style, {
    top: offsetY + box.top - 3 + 'px',
    left: offsetX + box.left - 3 + 'px',
    width: box.width + 6 + 'px',
    height: box.height + 6 + 'px',
  });
  elementOutlineLabel.textContent = finder(el);
}
export function onElementClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  if (lastEl) {
    sendEvent({
      event: 'elementSelected',
      selector: finder(lastEl),
    });
  }
}
export function startInspecting() {
  document.body.addEventListener('mousemove', onElementHover);
  document.body.addEventListener('click', onElementClick);
  elementOutline.style.display = 'block';
  document.body.style.cursor = 'pointer';
  lastEl = null;
}
export function stopInspecting() {
  document.body.removeEventListener('mousemove', onElementHover);
  document.body.removeEventListener('click', onElementClick);
  elementOutline.style.display = 'none';
  document.body.style.cursor = '';
}
