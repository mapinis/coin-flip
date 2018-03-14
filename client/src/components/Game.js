import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      socket: null,
      me: null,
      enemy: null,
      flipping: false,
      winner: "",
      winStatus: null
    };
  }

  componentDidMount() {
    const socket = socketIOClient("");
    this.setState({ socket: socket });

    socket.emit("joinGame", { gameID: this.state.gameID }, data => {
      if (data) {
        this.setState({
          me: {
            ready: data.ready,
            heads: data.heads
          }
        });
      }
    });

    socket.on("enemyInfo", data => {
      this.setState({
        enemy: {
          ready: data.ready,
          heads: data.heads
        }
      });
    });

    socket.on("enemyReady", () => {
      this.setState(s => ({
        enemy: {
          ...s.enemy,
          ready: !s.enemy.ready
        }
      }));
    });

    socket.on("flipping", () => {
      this.setState({ flipping: true });
    });

    socket.on("winDecided", headsWin => {
      this.setState({ winner: headsWin ? "heads" : "tails" });
    });

    socket.on("winStatus", status => {
      this.setState({ winStatus: status });
    });
  }

  ready() {
    this.state.socket.emit("ready", { gameID: this.state.gameID }, () => {
      this.setState(s => ({
        me: {
          ...s.me,
          ready: !s.me.ready
        }
      }));
    });
  }

  render() {
    return (
      <div className="Game">
        <p>GameID: {this.state.gameID}</p>
        {this.state.socket && <p>PlayerID: {this.state.socket.id}</p>}
        {this.state.me && (
          <div className="me">
            <p>Me Ready: {this.state.me.ready.toString()}</p>
            <p>Me: {this.state.me.heads ? "heads" : "tails"}</p>
          </div>
        )}
        {this.state.enemy && (
          <div className="enemy">
            <p>Enemy Ready: {this.state.enemy.ready.toString()}</p>
            <p>Enemy: {this.state.enemy.heads ? "heads" : "tails"}</p>
          </div>
        )}
        {!this.state.flipping && (
          <button onClick={this.ready.bind(this)}>Ready</button>
        )}
        {this.state.winner && <h2>Winner: {this.state.winner}</h2>}
        {this.state.winStatus && <h1>Winner</h1>}
      </div>
    );
  }
}

export default Game;
