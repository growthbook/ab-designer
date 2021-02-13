type ReadyEvent = {
  event: 'visualDesignerReady';
};
type ElementSelectedEvent = {
  event: 'elementSelected';
  selector: string;
};
type ScreenshotTakenEvent = {
  event: 'screenshotTaken';
  image: string;
};
type OutgoingMessage = ReadyEvent | ElementSelectedEvent | ScreenshotTakenEvent;

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
  mutations: DOMMutations;
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

// TODO: [string, MutationType, string][]
// Currently throwing an error due to mismatched typescript versions
type DOMMutations = any[];
