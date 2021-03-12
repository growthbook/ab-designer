# A/B Test Designer

This is one half of an interactive visual A/B test designer like the ones in Optimizely and Google Optimize.  This script is meant to be included on the page you are A/B testing.  A companion script would run on your Experimentation Platform.

Features:
*  Click to select elements like you would with DevTools
*  Apply DOM mutations and inject CSS on the target site to preview A/B test variations

How it works:
1.  The Experimentation Platform (ExP) loads the target site in an iframe
2.  The ExP sends commands to the iframe using postMessage (e.g. "select element", "inject CSS", "mutate DOM")
3.  The iframe sends data back to the ExP also using postMessage (e.g. the selected element data)

## Installation

On the target page you want to run an A/B test on:

```html
<!-- The origin of your experimentation platform (for security) -->
<script>window.EXP_PLATFORM_ORIGIN="https://example.com";</script>
<script async src="https://unpkg.com/ab-designer/dist/ab-designer.cjs.production.min.js"></script>
```

## Commands

These commands are sent from the Experimentation Platform to this script running within an iframe using postMessage.

### startInspecting

Acts like the DevTools Inspect tool.  As you hover over elements, they are highlighted and the selector is shown in a tooltip.

```json
{
  "command": "selectElement"
}
```

### stopInspecting

Stops the DevTools Inspect behavior and goes back to an interactive page.

```json
{
  "command": "stopSelectElement"
}
```

### hoverElement

Forces the hover state for the specified element

```json
{
  "command": "hoverElement",
  "selector": "h1",
  "ancestor": 0
}
```
The ancestor property lets you specify how far up the DOM tree to walk from the selector before applying the hover. `0` means use the element directly, `1` means use the parent, `2` is the grandparent, etc..

### selectElement

Forces the selected state for the specified element

```json
{
  "command": "selectElement",
  "selector": "h1",
  "ancestor": 0
}
```

The ancestor property lets you specify how far up the DOM tree to walk from the selector before applying the selected state. `0` means use the element directly, `1` means use the parent, `2` is the grandparent, etc..

### mutateDOM

Apply the specified DOM mutations to the page using [Dom Mutator](https://github.com/growthbook/dom-mutator). These calls are not cumulative; each time this is called it reverts all previous DOM mutations and starts fresh.

```json
{
  "command": "mutateDOM",
  "mutations": [
    {
      "selector": "h1",
      "action": "set",
      "attribute": "html",
      "value": "Hello <strong>World</strong>"
    }
  ]
}
```

### injectCSS

Inject the specified CSS to the page in an inline `<style>` tag. Like mutate, these calls are not cumulative and all previous CSS injections are removed first when called.

```json
{
  "command": "injectCSS",
  "css": "body { color: red; }"
}
```

### isReady

Check if the script is loaded and ready. Causes the iframe to send the `visualDesignerReady` event in response.

```json
{
  "command": "isReady"
}
```

## Events

These events are sent back to the parent page via postMessage

### visualDesignerReady

Sent when the page finishes loading or when an `isReady` command is sent.

```json
{
  "event": "visualDesignerReady"
}
```

### elementHover

Sent when a new element is hovered over while in Inspector mode.  Uses the [Finder](https://github.com/antonmedv/finder) library to generate unique CSS selectors.

```json
{
  "event": "elementHover",
  "selector": ".my-title",
  "display": "h1",
  "breadcrumb": ["html","body","main","div"]
}
```

### elementSelected

Sent when an element is clicked while in DevTools Inspect mode.  Uses the [Finder](https://github.com/antonmedv/finder) library to generate unique CSS selectors.

```json
{
  "event": "elementSelected",
  "selector": ".link",
  "display": "a",
  "breadcrumb": ["html","body","main","div"],
  "innerHTML": "Click Here",
  "attributes": [
    {
      "name": "href",
      "value": "/about"
    }
  ]
}
```