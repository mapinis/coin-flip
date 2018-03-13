import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';


class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      game: props.game
    }
  };

  componentDidMount() {
    const socket = socketIOClient("");
    socket.join(this.state.game.id);
  }

  render() {
    return (
      <div className="Game">
        <p>Game: {this.state.game}</p>
      </div>
    );
  }
}

export default Game;