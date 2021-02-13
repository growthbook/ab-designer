export function sendEvent(data: OutgoingMessage) {
  window.parent.postMessage(data, window.EXP_PLATFORM_ORIGIN || '*');
}
