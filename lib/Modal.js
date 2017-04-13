const React = require('react');
const FocusTrap = require('focus-trap-react');
const displace = require('react-displace');
const noScroll = require('no-scroll');

const PropTypes = require('prop-types');
const focusTrapFactory = React.createFactory(FocusTrap);

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.checkClick = this.checkClick.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  componentWillMount() {
    if (!this.props.titleText && !this.props.titleId) {
      throw new Error('react-aria-modal instances should have a `titleText` or `titleId`');
    }
    noScroll.on();
  }

  componentDidMount() {
    const props = this.props;
    if (props.onEnter) {
      props.onEnter();
    }
    // Timeout to ensure this happens *after* focus has moved
    const applicationNode = this.getApplicationNode();
    setTimeout(function() {
      if (applicationNode) {
        applicationNode.setAttribute('aria-hidden', 'true');
      }
    }, 0);
  }

  componentWillUnmount() {
    noScroll.off();
    const applicationNode = this.getApplicationNode();
    if (applicationNode) {
      applicationNode.setAttribute('aria-hidden', 'false');
    }
  }

  getApplicationNode() {
    if (this.props.getApplicationNode) return this.props.getApplicationNode();
    return this.props.applicationNode;
  }

  checkClick(event) {
    if (this.dialogNode && this.dialogNode.contains(event.target)) return;
    this.deactivate();
  }

  deactivate() {
    this.props.onExit();
  }

  render() {
    const props = this.props;

    const style = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1050,
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      textAlign: 'center',
    };
    if (props.underlayColor) {
      style.background = props.underlayColor;
    }
    if (props.underlayClickExits) {
      style.cursor = 'pointer';
    }
    if (props.underlayStyle) {
      for (const key in props.underlayStyle) {
        if (!props.underlayStyle.hasOwnProperty(key)) continue;
        style[key] = props.underlayStyle[key];
      }
    }

    const underlayProps = {
      className: props.underlayClass,
      style: style,
    };

    if (props.underlayClickExits) {
      underlayProps.onClick = this.checkClick;
    }

    const verticalCenterHelperProps = {
      key: 'a',
      style: {
        display: 'inline-block',
        height: '100%',
        verticalAlign: 'middle',
      },
    };

    const dialogStyle = {
      display: 'inline-block',
      textAlign: 'left',
      top: (props.verticallyCenter) ? '50%' : 0,
      maxWidth: '100%',
      cursor: 'default',
    };
    if (props.verticallyCenter) {
      dialogStyle.verticalAlign = 'middle';
    }

    const dialogProps = {
      key: 'b',
      ref: function(el) {
        this.dialogNode = el;
      }.bind(this),
      role: (props.alert) ? 'alertdialog' : 'dialog',
      id: props.dialogId,
      className: props.dialogClass,
      style: dialogStyle,
    };
    if (props.titleId) {
      dialogProps['aria-labelledby'] = props.titleId;
    } else if (props.titleText) {
      dialogProps['aria-label'] = props.titleText;
    }
    if (props.focusDialog) {
      dialogProps.tabIndex = '-1';
      dialogProps.style.outline = 0;
    }

    const childrenArray = [
      React.DOM.div(dialogProps, props.children),
    ];
    if (props.verticallyCenter) {
      childrenArray.unshift(React.DOM.div(verticalCenterHelperProps));
    }

    return focusTrapFactory(
      {
        focusTrapOptions: {
          initialFocus: (props.focusDialog)
            ? '#react-aria-modal-dialog'
            : props.initialFocus,
          escapeDeactivates: props.escapeExits,
          onDeactivate: this.deactivate,
        },
      },
      React.DOM.div(underlayProps, childrenArray)
    );
  }

}

Modal.defaultProps = {
  dialogId: 'react-aria-modal-dialog',
  underlayClickExits: true,
  escapeExits: true,
  underlayColor: 'rgba(0,0,0,0.5)',
};

Modal.propTypes = {
  onExit: PropTypes.func.isRequired,
  alert: PropTypes.bool,
  dialogClass: PropTypes.string,
  dialogId: PropTypes.string,
  focusDialog: PropTypes.bool,
  initialFocus: PropTypes.string,
  onEnter: PropTypes.func,
  titleId: PropTypes.string,
  titleText: PropTypes.string,
  underlayClass: PropTypes.string,
  underlayColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  underlayStyle: PropTypes.object,
  underlayClickExits: PropTypes.bool,
  escapeExits: PropTypes.bool,
  verticallyCenter: PropTypes.bool,
  applicationNode: PropTypes.shape({
    setAttribute: PropTypes.func.isRequired,
  }),
  getApplicationNode: PropTypes.func,
};

const DisplacedModal = displace(Modal);

DisplacedModal.renderTo = function(input) {
  return displace(Modal, { renderTo: input });
};

module.exports = DisplacedModal;
