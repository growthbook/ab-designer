# Visual A/B Test Designer

This is one half of an interactive visual A/B test designer like the ones in Optimizely and Google Optimize.  This script is meant to be included on the page you are A/B testing.  A companion script would run on your Experimentation Platform.

Features:
*  Click to select elements like you would with DevTools
*  Take screenshots of the entire page or specific elements (using html2canvas)
*  Apply DOM mutations and inject CSS on the target site to preview A/B test variations

How it works:
1.  The Experimentation Platform (ExP) loads the target site in an iframe
2.  The ExP sends commands to the iframe using postMessage (e.g. "select element", "take screenshot", "mutate DOM")
3.  The iframe sends data back to the ExP also using postMessage (e.g. the CSS selector of the element, screenshot image data)

## Commands

These commands are sent from the Experimentation Platform to this script running within an iframe using postMessage.

### selectElement

Acts like the DevTools Inspect tool.  As you hover over elements, they are highlighted and the selector is shown in a tooltip.

```json
{
  "command": "selectElement"
}
```

### stopSelectElement

Stops the DevTools Inspect behavior and goes back to an interactive page.

```json
{
  "command": "stopSelectElement"
}
```

### screenshot

Take a screenshot of the specified element using [html2canvas](https://github.com/niklasvh/html2canvas).

```json
{
  "command": "screenshot",
  "selector": "body"
}
```

### mutateDOM

Apply the specified DOM mutations to the page using [Dom Mutator](https://github.com/growthbook/dom-mutator). These calls are not cumulative; each time this is called it reverts all previous DOM mutations and starts fresh.

```json
{
  "command": "mutateDOM",
  "mutations": [
    ["div.example", "setHTML", "Hello <strong>World</strong>"]
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

## Events

These events are sent back to the parent page via postMessage

### visualDesignerReady

Sent when the page finishes loading.

```json
{
  "event": "visualDesignerReady"
}
```

### elementSelected

Sent when an element is clicked while in DevTools Inspect mode.  Uses the [Finder](https://github.com/antonmedv/finder) library to generate unique CSS selectors.

```json
{
  "event": "elementSelected",
  "selector": "div.example"
}
```

### screenshot

Sent when a screenshot is taken.

```json
{
  "event": "screenshot",
  "image": "data:image/png;base64,iV..."
}
```