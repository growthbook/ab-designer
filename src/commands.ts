import mutate, { DeclarativeMutation } from 'dom-mutator';

let style: HTMLStyleElement;
export function injectCSS(css: string) {
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
  }
  style.innerHTML = css;
}

let revert: () => void;
export function mutateDOM(mutations: DeclarativeMutation[]) {
  // Undo previous mutations
  if (revert) {
    revert();
  }

  let callbacks: (() => void)[] = [];

  mutations.forEach(mutation => {
    const controller = mutate.declarative(mutation);
    callbacks.push(controller.revert);
  });

  revert = () => {
    callbacks.forEach(f => f());
  };
}
