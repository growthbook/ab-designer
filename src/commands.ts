import mutate from 'dom-mutator';
import html2canvas from 'html2canvas';
import { sendEvent } from './events';
import { startInspecting, stopInspecting } from './inspector';

let style: HTMLStyleElement;
export function injectCSS(css: string) {
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
  }
  style.innerHTML = css;
}

let revert: () => void;
export function mutateDOM(mutations: DOMMutations) {
  // Undo previous mutations
  if (revert) {
    revert();
  }

  let callbacks: (() => void)[] = [];

  mutations.forEach(([selector, mutation, value]) => {
    callbacks.push(mutate(selector, mutation, value));
  });

  revert = () => {
    callbacks.forEach(f => f());
  };
}

export async function takeScreenshot(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    const canvas = await html2canvas(el as HTMLElement);
    const image = canvas.toDataURL();
    sendEvent({
      event: 'screenshotTaken',
      image,
    });
  }
}

export function selectElement() {
  startInspecting();
}
export function stopSelectElement() {
  stopInspecting();
}
