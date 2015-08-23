# react-aria-modal

A fully flexible and accessible React modal built according WAI-ARIA Authoring Practices.

"Flexible" mostly means that this module provides minimal inline styles to get the thing working, but does not provide "complete" modal styling that would get in you way. You get to (have to) style the dialog yourself. Essentially, this module provides a "smart" minimally styled component to wrap you "dumb" fully styled component.

This module is built on top of some vanilla JS modules that could be used by non-React libraries:
- [focus-trap](https://github.com/davidtheclark/focus-trap)
- [no-scroll](https://github.com/davidtheclark/no-scroll)

(It doesn't directly depend on focus-trap, but uses [focus-trap-react](https://github.com/davidtheclark/focus-trap-react),
a focus-trap wrapper which could be used by other React libraries.)

[Check out the demo.](http://davidtheclark.github.io/react-aria-modal/demo/)

**If you like this kind of module (accessible, flexible, unstyled) you should also check out these projects:**
- [react-aria-menubutton](https://github.com/davidtheclark/react-aria-menubutton)
- [react-aria-tabpanel](https://github.com/davidtheclark/react-aria-tabpanel)

## Installation

```
npm install react-aria-modal
```

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

  render: function() {
    return (
      <div>
        <button onClick={this.activateModal}>
          activate modal
        </button>
        <AriaModal
          active={this.state.modalActive}
          titleText='demo one'
          onExit={this.deactivateModal}
          initialFocus='#demo-one-deactivate'
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
- mounting the component *without* an `active` prop
- passing `true` as the `active` prop

Similarly, the modal can be deactivated in a couple of ways:
- unmounting the component
- passing `false` as the `active` prop

Pass your dialog element as the child. And that's it.

When the modal is active, you'll notice the following:
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

### alert

Type: `Boolean`

If `true`, the modal will receive a `role` of `alertdialog`, instead of its default `dialog`.

### initialFocus

Type: `String`

By default, *when the modal activates its first focusable child will receive focus*. If, instead, you want to identify a specific element that should receive initial focus, pass a *selector string* to this prop. (That selector is passed to `document.querySelector()` to find the DOM node.)

Demo example 3 and an additional example below illustrate a good method if you want no initial visible focus. (Add `tabIndex='0'` to the modal's content and give it `outline: 0;`.)

### titleId

Type: `String`

The id of the element that should be used as the modal's accessible title. This value is passed to the modal's `aria-labelledby` attribute.

You must use either `titleId` or `titleText`, but not both.

### titleText

Type: `String`

A string to use as the modal's accessible title. This value is passed to the modal's `aria-label` attribute.

You must use either `titleId` or `titleText`, but not both.

### underlayClass

Type: `String`

Apply a class to the underlay in order to custom-style it.

This module does apply various inline styles, though, so be aware that overriding some styles might be difficult. If, for example, you want to change the underlay's color, you should probably use the `underlayColor` prop instead of a class.

### underlayClickExits

Type: `Boolean`, Default `true`

By default, a click on the underlay will exit the modal. Pass `false`, and clicking on the underlay will do nothing.

### underlayColor

Type: `String` (color value), Default: `rgba(0,0,0,0.5)`

If you want to change about the underlay's color, you can do that with this prop.

### verticallyCenter

Type: `Boolean`

If `true`, the modal's contents will be vertically (as well as horizontally) centered.

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
        titleId='modal-title'
        underlayClickExists={false}
        verticallyCenter={true}
      >
        <div
          tabIndex='0'
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

## Coming soon

- Unit tests
- Function children (primarily useful for animation)
