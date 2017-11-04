import React, { Component } from 'react';
import './App.css';

class Button extends Component {
  constructor(props){
    super(props);
    this.state = {buttonText: props.buttonText, clickedText: props.clickedText, clicked: false};
  }

  click(e) {
    this.setState(s => ({clicked: !s.clicked}))
  }

  render() {
    return (
      <button onClick = {this.click.bind(this)} className={this.state.clicked ? "clicked": "unclicked"}>
        {this.state.clicked ? this.state.clickedText : this.state.buttonText}
      </button>
    );
  }

}

class App extends Component {
  render() {

    return (
      <div className="App">
        <Button buttonText="ready" clickedText="waiting..." />
        <Button buttonText="click me" clickedText="clicked" />
      </div>
    );
  }
}

export default App;
