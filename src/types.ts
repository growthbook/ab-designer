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
type OutgoingMessage = ReadyEvent | ElementHoverEvent | ElementSelectedEvent;

type StartInspectingCommand = {
  command: 'startInspecting';
};
type StopInspectingCommand = {
  command: 'stopInspecting';
};
type IsReadyCommand = {
  command: 'isReady';
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
  mutations: {
    selector: string;
    action: 'set' | 'append' | 'remove';
    attribute: string;
    value: string;
  }[];
};

type IncomingMessage =
  | StartInspectingCommand
  | StopInspectingCommand
  | HoverElementCommand
  | SelectElementCommand
  | InjectCSSMessage
  | MutateDOMMessage
  | IsReadyCommand;
