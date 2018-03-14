import React, { Component } from 'react';
import './MockLockableButton.css';

import LockableButton from './LockableButton.js';

/* 
  Mock Lockable Button
  Button that looks exactly like Lockable Button, except does nothing on hover and
  doesn't click!
*/

class MockLockableButton extends Component {
  render() {
    return (
      <div className="mock">
        <LockableButton
          clicked={this.props.clicked}
          onClick={() => {}}
          clickedText={this.props.clickedText}
          lockedText={this.props.lockedText}
          locked={this.props.locked}>
          {this.props.children}
        </LockableButton>
      </div>
    );
  }
}

export default MockLockableButton;
