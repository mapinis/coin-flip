import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';


class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      playerID: props.playerID,
      me: {},
      emeny: {}
    }
  };

  componentDidMount() {
    const socket = socketIOClient("");
    //socket.join(this.state.game.id);
  }

  render() {
    return (
      <div className="Game">
        <p>GameID: {this.state.game.id}</p>
        {Array.from(this.state.game.players, (player, i) => 
          (<div className="player">
            <p>Player Ready: {player.ready.toString()}</p>
            <p>Player Heads: {player.heads.toString()}</p>
          </div>)
        )}
      </div>
    );
  }
}

export default Game;