import React, { Component } from 'react';
import classNames from 'classnames';
import './LockableButton.css';

/* 
  Lockable Button:
    Button that can be locked
    If a clickedText is provided, it switches to that text upon click
    If a lockedText is provided, it switches to that upon lock
*/

class LockableButton extends Component {
  render() {
    const buttonClasses = classNames({
      clicked: this.props.clicked,
      unclicked: !this.props.clicked,
      locked: this.props.locked,
      clickable: !this.props.locked
    });

    return (
      <button
        onClick={!this.props.locked ? this.props.onClick.bind(this) : null}
        className={buttonClasses}>
        {this.props.lockedText && this.props.locked
          ? this.props.lockedText
          : this.props.clicked
            ? this.props.clickedText
              ? this.props.clickedText
              : this.props.children
            : this.props.children}
      </button>
    );
  }
}

export default LockableButton;
