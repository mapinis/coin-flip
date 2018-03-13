import React, { Component } from "react";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      socket: props.socket,
      me: null,
      emeny: null
    };
  }

  componentDidMount() {
    //console.log(this.state.socket)
    this.state.socket.emit(
      "joinGame",
      { gameID: this.state.gameID },
      data => {
        if (data) {
          this.setState({
            me: {
              ready: data.ready,
              heads: data.heads
            }
          });
        }
      }
    );
  }

  render() {
    return (
      <div className="Game">
        <p>GameID: {this.state.gameID}</p>
        <p>PlayerID: {this.state.socket.id}</p>
        {this.state.me && (
          <div className="me">
            <p>Me Ready: {this.state.me.ready.toString()}</p>
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
