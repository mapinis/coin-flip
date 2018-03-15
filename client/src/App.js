import React, { Component } from 'react';
import './App.css';

import Game from './components/Game.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputtedID: '',
      gameID: ''
    };
  }

  componentDidMount() {
    document.title = 'Coin Flip';
  }

  callAPI = async (url, options = null) => {
    const response = await fetch(url, options);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  createGame() {
    this.callAPI('/api/create')
      .then(res => {
        this.setState({ inputtedID: res.newGameID });
        this.validateGame.bind(this)();
      })
      .catch(err => console.log(err));
  }

  validateGame(event) {
    if (event) {
      event.preventDefault();
    }
    this.callAPI('/api/validate/' + this.state.inputtedID)
      .then(res => {
        if (res.error) {
          console.log(res.error);
          // Error handling to come later
        } else if (res.success) {
          this.setState(s => ({ gameID: s.inputtedID }));
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        {!this.state.gameID && (
          <div className="index">
            <button onClick={this.createGame.bind(this)}>Create Game</button>
            <form onSubmit={this.validateGame.bind(this)}>
              <label>
                Game ID:
                <input
                  type="text"
                  value={this.state.inputtedID}
                  onChange={event => {
                    this.setState({ inputtedID: event.target.value });
                  }}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
        {this.state.gameID && <Game gameID={this.state.gameID} />}
      </div>
    );
  }
}

export default App;
