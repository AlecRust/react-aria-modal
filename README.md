# react-aria-modal

A fully accessible and flexible React modal built according [WAI-ARIA Authoring Practices](http://www.w3.org/TR/wai-aria-practices/#dialog_modal).

This module provides a "smart" minimally styled component to wrap you "dumb" fully styled component. It provides the following features, while giving you complete control of the content:

  - Focus is trapped within the modal: Tab and Shift+Tab will cycle through the modal's focusable nodes
  without returning to the main document beneath.
  - Escape will close the modal.
  - Scrolling is frozen on the main document beneath the modal. (Although, sadly, you can still mess with the scrolling using a touch screen.)
  - When the modal closes, focus returns to the element that was focused just before the modal activated.
  - The dialog element has an ARIA `role` of `dialog` (or `alertdialog`).
  - The dialog element has an ARIA attribute designating its title, either `aria-label` or `aria-labelledby`.
  - By default, clicking on the modal's underlay (outside the dialog element) will close the modal (this can be disabled).
  - The modal is appended to the end of `document.body` instead of its taking up its source-order position within the React component tree.

"Flexible" mostly means that this module provides absolutely minimal inline styles — just enough to get the thing working — but does not provide "complete" modal styling that would get in your way. You get to (have to) style the dialog yourself. (Maybe make a fancy-looking modal module that others could use, which depends on this one behind the scenes?)

[Check out the demo.](http://davidtheclark.github.io/react-aria-modal/demo/)

## Project Goals

- Full accessibility
- Maximum flexibility
- Absolutely minimal styling
- Modular construction: this module is built on top of a few small JS modules that could be used by other React and non-React frontend components:
  - [focus-trap](https://github.com/davidtheclark/focus-trap), via [focus-trap-react](https://github.com/davidtheclark/focus-trap-react)
  - [no-scroll](https://github.com/davidtheclark/no-scroll)
  - [react-displace](https://github.com/davidtheclark/react-displace)

**If you like this kind of module (accessible, flexible, unstyled) you should also check out these projects:**
- [react-aria-menubutton](https://github.com/davidtheclark/react-aria-menubutton)
- [react-aria-tabpanel](https://github.com/davidtheclark/react-aria-tabpanel)

## Installation

```
npm install react-aria-modal
```

You'll need to be compiling CommonJS modules.

### React Dependency

Version 2+ is compatible with React 0.14.

Version 1+ is compatible with React 0.13.

## Usage

Just provide the right props (see below) and pass the content of the modal as this component's child.

Look in `demo/js/` for example code. (And see what they look like [here]((http://davidtheclark.github.io/react-aria-modal/demo/).) But here's a simple example.

```js
var AriaModal = require('react-aria-modal');

var DemoOne = React.createClass({
  getInitialState: function() {
    return { modalActive: false };
  },

  activateModal: function() {
    this.setState({ modalActive: true });
  },

  deactivateModal: function() {
    this.setState({ modalActive: false });
  },

  getApplicationNode: function() {
    return document.getElementById('my-application');
  },

  render: function() {
    return (
      <div>
        <button onClick={this.activateModal}>
          activate modal
        </button>
        <AriaModal
          mounted={this.state.modalActive}
          titleText='demo one'
          onExit={this.deactivateModal}
          initialFocus='#demo-one-deactivate'
          getApplicationNode={this.getApplicationNode}
        >
          <div className='modal-dialog'>
            <p>
              Here is a modal.
            </p>
            <p>
              <button
                id='demo-one-deactivate'
                onClick={this.deactivateModal}
              >
                deactivate modal
              </button>
            </p>
          </div>
        </AriaModal>
      </div>
    )
  },
});
```

## Details

The modal can be activated in a couple of ways:
- mounting the component *without* an `mounted` prop
- passing `true` as the `mounted` prop

Similarly, the modal can be deactivated in a couple of ways:
- unmounting the component
- passing `false` as the `mounted` prop

Pass your dialog element as the child. And that's it.

When the modal is mounted, you'll notice the following:
- Focus is trapped: only elements within the modal will receive focus as you tab through. This is done by [focus-trap](https://github.com/davidtheclark/focus-trap), via [focus-trap-react](https://github.com/davidtheclark/focus-trap-react).
- The modal has the ARIA attributes it needs: a `role` of `dialog` (or `alertdialog`) and an `aria-label` or `aria-labelledby` attribute.
- The main document's scroll is frozen (except on touchscreens). This is done by [no-scroll](https://github.com/davidtheclark/no-scroll).
- Your content is set atop a fixed-position underlay. You can control the appearance and behavior of this underlay in various ways (see below).
- Your content is horizontally centered. You can also vertically center it, if you wish.
- The modal is appended to `document.body`, not inserted directly into the HTML source order, as you might assume; but it should still update correctly. (This makes positioning easier (no weird nested z-index troubles).)

## Props

### onExit

Type: `Function`, required

This function needs to handles the state change of *exiting* (or deactivating) the modal.

Maybe it's just a wrapper around `setState()`; or maybe you use some more involved Flux-inspired state management — whatever the case, this module leaves the state management up to *you* instead of making assumptions. That also makes it easier to create your own "close modal" buttons; because you have the function that closes the modal right there, written by you, at your disposal.

### applicationNode

Type: `DOM Node`

Provide your main application node here (which the modal should render outside of), and when the modal is open this application node will receive the attribute `aria-hidden="true"`. This [can help screen readers understand what's going on](https://www.w3.org/WAI/GL/wiki/Using_ARIA_role%3Ddialog_to_implement_a_modal_dialog_box#Description).

This module can't guess your application node, so you have to provide this prop to get the full accessibility benefit.

### getApplicationNode

Type: `Function`

Same as `applicationNode`, but a function that returns the node instead of the node itself. This can be useful or necessary in a variety of situations, one of which is server-side React rendering. The function will not be called until after the component mounts, so it is safe to use browser globals and refer to DOM nodes within it (e.g. `document.getElementById(..)`), without ruining your server-side rendering.

### alert

Type: `Boolean`

If `true`, the modal will receive a `role` of `alertdialog`, instead of its default `dialog`.

### dialogClass

Type: `String`

Apply a class to the dialog in order to custom-style it.

Be aware that this module does apply various inline styles to the dialog element in order position it.

### dialogId

Type: `String`, Default: `react-aria-modal-dialog`

Choose your own id attribute for the dialog element.

### focusDialog

Type: `Boolean`

By default, when the modal activates its first focusable child will receive focus.
However, if `focusDialog` is `true`, the dialog itself will receive initial focus —
and that focus will be hidden. (This is essentially what Bootstrap does with their modal.)

See the example below.

### initialFocus

Type: `String`

By default, when the modal activates its first focusable child will receive focus. If, instead, you want to *identify a specific element that should receive initial focus*, pass a *selector string* to this prop. (That selector is passed to `document.querySelector()` to find the DOM node.)

Demo example 3 and an additional example below illustrate a good method if you want no initial visible focus. (Add `tabIndex='0'` to the modal's content and give it `outline: 0;`.)

### mounted

Type: `Boolean`

By default, the modal is active when mounted, deactivated when unmounted.
However, you can also control its active/inactive state by changing its `mounted` property instead.

The following two examples are near-equivalents — the first mounts and unmounts, while the second changes the `mounted` prop:

```js
var MyComponent = React.createClass({
  ..
  render: function() {
    ..
    var modal = (this.state.modalActive) ? (
      <AriaModal onExit={this.myExitHandler}>
        {modalContents}
      </AriaModal>
    ) : false;
    return <div>{modal}</div>;
  },
});

var MyComponentTakeTwo = React.createClass({
  ..
  render: function() {
    ..
    return (
      <div>
        <AriaModal
          mounted={this.state.modalActive}
          onExit={this.myExitHandler}
        >
          {modalContents}
        </AriaModal>
      </div>
    );
  },
});
```

### onEnter

Type: `Function`

This function is called in the modal's `componentDidMount()` lifecycle method.
You can use it to do whatever diverse and sundry things you feel like doing after the modal activates.

Demo Five, for example, uses it to modify class names and enable some CSS transitions.

### titleId

Type: `string`

The id of the element that should be used as the modal's accessible title. This value is passed to the modal's `aria-labelledby` attribute.

You must use either `titleId` or `titleText`, but not both.

### titleText

Type: `string`

A string to use as the modal's accessible title. This value is passed to the modal's `aria-label` attribute.

You must use either `titleId` or `titleText`, but not both.

### underlayClass

Type: `string`

Apply a class to the underlay in order to custom-style it.

This module does apply various inline styles, though, so be aware that overriding some styles might be difficult. If, for example, you want to change the underlay's color, you should probably use the `underlayColor` prop instead of a class.

### underlayClickExits

Type: `boolean`, Default: `true`

By default, a click on the underlay will exit the modal. Pass `false`, and clicking on the underlay will do nothing.

### escapeExits

Type: `boolean`, Default: `true`

By default, the Escape key exits the modal. Pass `false`, and it won't.

### underlayColor

Type: `string` (color value) or `false`, Default: `rgba(0,0,0,0.5)`

If you want to change the underlay's color, you can do that with this prop.

If `false`, no background color will be applied with inline styles.
Presumably you will apply then yourself via an `underlayClass`.

### verticallyCenter

Type: `boolean`

If `true`, the modal's contents will be vertically (as well as horizontally) centered.

### renderTo

Type: `HTMLElement` or `string` selector

react-aria-modal uses [react-displace](https://github.com/davidtheclark/react-displace) to insert the modal into a new element at the end of `<body>`, making it easier to deal with positioning and z-indexes. Use this prop to specify an alternative element into which the modal should be rendered.

Strings are used as selectors, passed to `querySelector`.

## More examples

An alert dialog that itself receives initial focus (but has no visible outline) and does not exit when the underlay is clicked, and is vertically centered:

```js
var AriaModal = require('react-aria-modal');

var MyModal = React.createClass({
  ..
  render: function() {
    return (
      <AriaModal
        onExit={this.myExitHandler}
        alert={true}
        focusDialog={true}
        titleId='modal-title'
        underlayClickExits={false}
        verticallyCenter={true}
      >
        <div
          style={{ outline: 0 }}
          className='my-modal-dialog'
        >
          <h2 id='modal-title'>Alert!</h2>
          ..
        </div>
      </AriaModal>
    )
  }
})
```

## Contributing & Development

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Lint with `npm run lint`.

Test the demos with `npm start`.
