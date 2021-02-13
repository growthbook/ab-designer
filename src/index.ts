import mutate from 'dom-mutator';
import { finder } from '@medv/finder';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    EXP_PLATFORM_ORIGIN: string;
  }
}

let style: HTMLStyleElement;
function injectCSS(css: string) {
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
  }
  style.innerHTML = css;
}

let revert: () => void;
function mutateDOM(mutations: any[]) {
  // Undo previous mutations
  if (revert) {
    revert();
  }

  let callbacks: (() => void)[];

  mutations.forEach(([selector, mutation, value]) => {
    callbacks.push(mutate(selector, mutation, value));
  });

  revert = () => {
    callbacks.forEach(f => f());
  };
}

async function takeScreenshot(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    const canvas = await html2canvas(el as HTMLElement);
    const image = canvas.toDataURL();
    sendEvent('screenshotTaken', {
      image,
    });
  }
}

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
function onElementHover(e: MouseEvent) {
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
function onElementClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  if (lastEl) {
    sendEvent('elementSelected', {
      selector: finder(lastEl),
    });
  }
}

function selectElement() {
  document.body.addEventListener('mousemove', onElementHover);
  document.body.addEventListener('click', onElementClick);
  elementOutline.style.display = 'block';
  document.body.style.cursor = 'pointer';
  lastEl = null;
}
function stopSelectElement() {
  document.body.removeEventListener('mousemove', onElementHover);
  document.body.removeEventListener('click', onElementClick);
  elementOutline.style.display = 'none';
  document.body.style.cursor = '';
}

function sendEvent<T = any>(event: string, data?: T) {
  window.parent.postMessage(
    {
      event,
      ...data,
    },
    window.EXP_PLATFORM_ORIGIN || '*'
  );
}

type SelectElementMessage = {
  command: 'selectElement';
};
type StopSelectElementMessage = {
  command: 'stopSelectElement';
};
type TakeScreenshotMessage = {
  command: 'takeScreenshot';
  selector: string;
};
type MutateDOMMessage = {
  command: 'mutateDOM';
  mutations: any[];
};
type InjectCSSMessage = {
  command: 'injectCSS';
  css: string;
};

type IncomingMessage =
  | SelectElementMessage
  | StopSelectElementMessage
  | TakeScreenshotMessage
  | MutateDOMMessage
  | InjectCSSMessage;

window.addEventListener(
  'message',
  (event: MessageEvent<IncomingMessage>) => {
    if (
      window.EXP_PLATFORM_ORIGIN &&
      window.EXP_PLATFORM_ORIGIN !== '*' &&
      event.origin !== window.EXP_PLATFORM_ORIGIN
    ) {
      console.error('Ignoring message from invalid origin', event.origin);
      return;
    }

    const data = event.data;
    if (!data || !data.command) {
      return;
    }
    if (data.command === 'injectCSS') {
      injectCSS(data.css);
    } else if (data.command === 'mutateDOM') {
      mutateDOM(data.mutations);
    } else if (data.command === 'selectElement') {
      selectElement();
    } else if (data.command === 'stopSelectElement') {
      stopSelectElement();
    } else if (data.command === 'takeScreenshot') {
      takeScreenshot(data.selector);
    }
  },
  false
);

// Ready to start accepting commands
sendEvent('visualDesignerReady');
