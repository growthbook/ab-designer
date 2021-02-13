import {
  injectCSS,
  mutateDOM,
  selectElement,
  stopSelectElement,
  takeScreenshot,
} from './commands';
import { sendEvent } from './events';

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
sendEvent({
  event: 'visualDesignerReady',
});
