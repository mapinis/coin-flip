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

    socket.on("enemyLeft", () => {
      // Enemy is null of course!
      // Also, flipping, winner, your readiness, and winStatus need to be reset, as all context is now different
      this.setState(s => ({
        me: {
          ...s.me,
          ready: false
        },
        enemy: null,
        flipping: false,
        winner: "",
        winStatus: null
      }));
    });

    socket.on("flipping", () => {
      this.setState({ flipping: true });
    });

    // Because there is a chance that enemy leaves mid-data-transfer,
    // these two need to check if an enemy is actually present before applying
    // their changes, even though the server does check for this as well.

    socket.on("winDecided", headsWin => {
      if (this.state.enemy) {
        this.setState({ winner: headsWin ? "heads" : "tails" });
      }
    });

    socket.on("winStatus", status => {
      if (this.state.enemy) {
        this.setState({ winStatus: status });
      }
    });

    socket.on("reset", () => {
      this.setState(s => ({
        flipping: false,
        me: {
          ...s.me,
          ready: false
        },
        enemy: {
          ...s.enemy,
          ready: false
        }
      }));
    });
  }

  ready() {
    this.state.socket.emit("ready", () => {
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
