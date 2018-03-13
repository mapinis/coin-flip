import React, { Component } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

import Game from "./components/Game.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: "",
      gameID: ""
    };
  }

  callAPI = async (url, options = null) => {
    const response = await fetch(url, options);
    console.log("Response:");
    console.log(response)
    const body = await response.json();
    console.log("Body");
    console.log(body)
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  createGame() {
    this.callAPI("/api/create")
      .then(res => {
        this.setState({ gameID: res.gameID });
        this.joinGame.bind(this)();
      })
      .catch(err => console.log(err));
  }

  joinGame(event) {
    if (event) {
      event.preventDefault();
    }

    const socket = socketIOClient("")
    console.log(socket.id);

    console.log({
      gameID: this.state.gameID,
      playerID: socket.id
    });
    console.log(JSON.stringify({
      gameID: this.state.gameID,
      playerID: socket.id
    }));

    this.callAPI("/api/join", {
      method: "post",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameID: this.state.gameID,
        playerID: socket.id
      })
    })
      .then(res => {
        if (res.error) {
          console.log(res.error);
          // Error handling to come later
        }
        //console.log(res)
        //console.log(socket.id)
        //if (res.id === socket.id) {
          // making sure that IDs all check out
          this.setState({ socket: socket });
        //} else {
          // uh oh
        //}
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        {!this.state.socket && (
          <div className="index">
            <button onClick={this.createGame.bind(this)}>Create Game</button>
            <form onSubmit={this.joinGame.bind(this)}>
              <label>
                Game ID:
                <input
                  type="text"
                  value={this.state.gameID}
                  onChange={event => {
                    this.setState({ gameID: event.target.value });
                  }}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
        {this.state.socket &&(
          <Game gameID={this.state.gameID} socket={this.state.socket} />
        )}
      </div>
    );
  }
}

export default App;
