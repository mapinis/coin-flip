import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      socket: null,
      me: null,
      enemy: null
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
      }))
    });
  }

  ready() {
    this.state.socket.emit("ready", {gameID: this.state.gameID}, () => {
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
            <button onClick={this.ready.bind(this)}>Ready</button>
            <p>Me Heads: {this.state.me.heads.toString()}</p>
          </div>
        )}
        {this.state.enemy && (
          <div className="enemy">
            <p>Enemy Ready: {this.state.enemy.ready.toString()}</p>
            <p>Enemy Heads: {this.state.enemy.heads.toString()}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
