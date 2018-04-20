import React, { Component } from 'react';
import './App.css';

import Game from './components/Game.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputtedID: '',
      gameID: '',
      idError: ''
    };
  }

  componentDidMount() {
    document.title = 'Coin Flip';
  }

  callAPI = async (url, options = null) => {
    const response = await fetch(url, options);
    return await response.json();
  };

  createGame() {
    this.callAPI('http://localhost:8080/api/create').then(res => {
      this.setState({ inputtedID: res.newGameID });
      this.validateGame.bind(this)();
    });
  }

  validateGame(event) {
    if (event) {
      event.preventDefault();
    }
    this.callAPI('http://localhost:8080/api/validate/' + this.state.inputtedID).then(res => {
      if (res.error) {
        this.setState({
          idError: 'error: ' + res.error
        });
      } else if (res.success) {
        this.setState(s => ({ gameID: s.inputtedID }));
      }
    });
  }

  render() {
    return (
      <div className="App">
        {!this.state.gameID && (
          <div className="index">
            <h1>Coin Flip</h1>
            <form onSubmit={this.validateGame.bind(this)}>
              <label>
                <h2>Join Game:</h2>
                <input
                  type="text"
                  value={this.state.inputtedID}
                  placeholder="Enter Game Code"
                  onChange={event => {
                    this.setState({ inputtedID: event.target.value });
                  }}
                />
              </label>
              <input type="submit" value="Join" />
            </form>
            {this.state.idError && (
              <p style={{ color: 'red' }}>{this.state.idError}</p>
            )}
            <h3>or</h3>
            <button onClick={this.createGame.bind(this)}>
              Create New Game
            </button>
          </div>
        )}
        {this.state.gameID && <Game gameID={this.state.gameID} />}
      </div>
    );
  }
}

export default App;
