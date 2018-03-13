import React, { Component } from "react";
import "./App.css";

import Game from "./components/Game.js";

/*class Button extends Component {
  constructor(props){
    super(props);
    this.state = {clicked: false};
  }

  click(e) {
    this.setState(s => ({clicked: !s.clicked}))
  }

  render() {
    return (
      <button onClick = {this.click.bind(this)} className={this.state.clicked ? "clicked": "unclicked"}>
        {this.state.clicked ? this.props.clickedText : this.props.buttonText}
      </button>
    );
  }

}*/

/*<Button buttonText="ready" clickedText="waiting..." />
        <Button buttonText="click me" clickedText="clicked" />*/

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerID: '',
      gameID: ''
    }
  }

  callAPI = async (url) => {
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  createGame() {
    this.callAPI('/api/create')
      .then(res => {
        this.setState({gameID: res.gameID});
        this.joinGame.bind(this)();})
      .catch(err => console.log(err));
  }

  joinGame(event) {
    if(event) {
      event.preventDefault();
    }
    this.callAPI('/api/join/' + this.state.gameID)
      .then(res => 
        {
          if(res.error) {
            console.log(res.error);
            // Error handling to come later
          }

          console.log(res.id)
          this.setState({ playerID: res.id });
        })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <div className="App">
        {!this.state.playerID && 
          <div className="index">
            <button onClick={this.createGame.bind(this)}>Create Game</button>
            <form onSubmit={this.joinGame.bind(this)}>
              <label>
                Game ID:
                <input type="text" value={this.state.gameID} onChange={(event) => {this.setState({ gameID: event.target.value })}}/>
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>}
        {this.state.playerID &&
          <Game gameID={this.state.gameID} playerID={this.state.playerID} />
        }
      </div>
    );
  }
}

export default App;
