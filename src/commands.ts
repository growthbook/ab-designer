import mutate from 'dom-mutator';

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
