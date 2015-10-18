var React = require('react');
var ReactDOM = require('react-dom');
var AriaModal = require('../../');

var DemoFour = React.createClass({
  getInitialState: function() {
    return {
      modalActive: false,
    };
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
          titleText='demo four'
          onExit={this.deactivateModal}
          initialFocus='#demo-four-deactivate'
          mounted={this.state.modalActive}
        >
          <div id='demo-four-modal' className='modal'>
            <div className='modal-body'>
              <p>
                Here is a modal <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
              </p>
            </div>
            <footer className='modal-footer'>
              <button id='demo-four-deactivate' onClick={this.deactivateModal}>
                deactivate modal
              </button>
            </footer>
          </div>
        </AriaModal>
      </div>
    )
  },
});

ReactDOM.render(<DemoFour />, document.getElementById('demo-four'));
