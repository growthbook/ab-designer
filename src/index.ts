import { injectCSS, mutateDOM } from './commands';
import { sendEvent } from './events';
import {
  hoverElement,
  selectElement,
  startInspecting,
  stopInspecting,
} from './inspector';

declare global {
  interface Window {
    EXP_PLATFORM_ORIGIN: string;
  }
}

window.addEventListener(
  'message',
  (event: MessageEvent) => {
    if (
      window.EXP_PLATFORM_ORIGIN &&
      window.EXP_PLATFORM_ORIGIN !== '*' &&
      event.origin !== window.EXP_PLATFORM_ORIGIN
    ) {
      console.log('Ignoring message from invalid origin', event.origin);
      return;
    }

    const data = event.data as IncomingMessage;
    if (!data || !data.command) {
      return;
    }
    if (data.command === 'injectCSS') {
      injectCSS(data.css);
    } else if (data.command === 'mutateDOM') {
      mutateDOM(data.mutations);
    } else if (data.command === 'startInspecting') {
      startInspecting();
    } else if (data.command === 'stopInspecting') {
      stopInspecting();
    } else if (data.command === 'selectElement') {
      selectElement(data.selector, data.ancestor || 0);
    } else if (data.command === 'hoverElement') {
      hoverElement(data.selector, data.ancestor || 0);
    } else if (data.command === 'isReady') {
      sendEvent({
        event: 'visualDesignerReady',
      });
    }
  },
  false
);

// Ready to start accepting commands
sendEvent({
  event: 'visualDesignerReady',
});
