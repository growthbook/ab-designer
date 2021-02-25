type ElementBreadcrumb = string[];
type ElementAttribute = {
  name: string;
  value: string;
};

type ReadyEvent = {
  event: 'visualDesignerReady';
};
type ElementHoverEvent = {
  event: 'elementHover';
  selector: string;
  display: string;
  breadcrumb: ElementBreadcrumb;
};
type ElementSelectedEvent = {
  event: 'elementSelected';
  selector: string;
  display: string;
  breadcrumb: ElementBreadcrumb;
  innerHTML: string;
  attributes: ElementAttribute[];
};
type ScreenshotTakenEvent = {
  event: 'screenshotTaken';
  image: string;
};
type OutgoingMessage =
  | ReadyEvent
  | ElementHoverEvent
  | ElementSelectedEvent
  | ScreenshotTakenEvent;

type StartInspectingCommand = {
  command: 'startInspecting';
};
type StopInspectingCommand = {
  command: 'stopInspecting';
};
type HoverElementCommand = {
  command: 'hoverElement';
  selector: string;
  ancestor: number;
};
type SelectElementCommand = {
  command: 'selectElement';
  selector: string;
  ancestor: number;
};
type InjectCSSMessage = {
  command: 'injectCSS';
  css: string;
};
type MutateDOMMessage = {
  command: 'mutateDOM';
  mutations: DOMMutations;
};
type TakeScreenshotMessage = {
  command: 'takeScreenshot';
  selector: string;
};

type IncomingMessage =
  | StartInspectingCommand
  | StopInspectingCommand
  | HoverElementCommand
  | SelectElementCommand
  | InjectCSSMessage
  | MutateDOMMessage
  | TakeScreenshotMessage;

// TODO: [string, MutationType, string][]
// Currently throwing an error due to mismatched typescript versions
type DOMMutations = any[];
