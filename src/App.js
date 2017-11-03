import React, { Component } from 'react';
import './App.css';

// const Header = ({text}) => <h1>{text.length}</h1>

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
  constructor(props){
    super(props)
    this.state = {counter:1};
  }

  onIncrement(e){
    this.setState(s => ({counter: s.counter + 1}))
  }

  onDecrement(e){
    this.setState(s => ({counter: s.counter - 1}))
  }

  onReset(e){
    this.setState({counter:1});
  }

  render() {
    // const headers = ["This", "Is", "A", "Test"]

    return (
      <div className="App">
        {/*
        <h1>{this.state.counter}</h1>
        <button onClick={this.onIncrement.bind(this)}>+</button>
        <button onClick={this.onDecrement.bind(this)}>-</button>
        <button onClick={() => this.onReset()}>1</button> */}
        <Button buttonText="ready" clickedText="waiting..." />
        <Button buttonText="click me" clickedText="clicked" />
      </div>
    );
  }
}

export default App;
