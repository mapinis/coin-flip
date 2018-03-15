import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './Game.css';

import LockableButton from './LockableButton.js';
import MockLockableButton from './MockLockableButton.js';

import coinHeads from '../rec/heads.svg';
import coinTails from '../rec/tails.svg';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      socket: null,
      me: null,
      enemy: null,
      flipping: false,
      winner: '',
      winStatus: null
    };
  }

  componentDidMount() {
    const socket = socketIOClient('');
    this.setState({ socket: socket });

    socket.emit('joinGame', { gameID: this.state.gameID }, data => {
      if (data) {
        this.setState({
          me: {
            ready: data.ready,
            heads: data.heads
          }
        });
      }
    });

    socket.on('enemyInfo', data => {
      this.setState({
        enemy: {
          ready: data.ready,
          heads: data.heads
        }
      });
    });

    socket.on('enemyReady', () => {
      this.setState(s => ({
        enemy: {
          ...s.enemy,
          ready: !s.enemy.ready
        }
      }));
    });

    socket.on('enemyLeft', () => {
      // Enemy is null of course!
      // Also, flipping, winner, your readiness, and winStatus need to be reset, as all context is now different
      this.setState(s => ({
        me: {
          ...s.me,
          ready: false
        },
        enemy: null,
        flipping: false,
        winner: '',
        winStatus: null
      }));
    });

    socket.on('flipping', () => {
      this.setState({ flipping: true, winner: '' });
    });

    // Because there is a chance that enemy leaves mid-data-transfer,
    // these two need to check if an enemy is actually present before applying
    // their changes, even though the server does check for this as well.

    socket.on('winDecided', headsWin => {
      if (this.state.enemy) {
        this.setState({ winner: headsWin ? 'Heads' : 'Tails' });
      }
    });

    socket.on('winStatus', status => {
      if (this.state.enemy) {
        this.setState({ winStatus: status });
      }
    });

    socket.on('reset', () => {
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
    this.state.socket.emit('ready', () => {
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
      <div className="game">
        <div className="section me">
          {this.state.me && (
            <div className="inner">
              <img
                alt={
                  this.state.me.heads
                    ? 'Your coin with side heads'
                    : 'Your coin with side tails'
                }
                src={this.state.me.heads ? coinHeads : coinTails}
              />
              <h1>You</h1>
              <LockableButton
                clicked={this.state.me.ready}
                onClick={this.ready.bind(this)}
                clickedText="Ready"
                lockedText="Flipping"
                locked={this.state.flipping}>
                Ready Up
              </LockableButton>
              {this.state.winner && this.state.winStatus && (
                <h1>Winner!</h1>
              )}
            </div>
          )}
        </div>
        <div className="section inner flipzone">
          {this.state.winner &&
            !this.state.flipping && (
              <div>
                <img
                  alt={
                    this.state.winner === 'Heads'
                      ? 'Winning coin with side heads'
                      : 'Winning coin with side tails'
                  }
                  src={this.state.winner === 'Heads' ? coinHeads : coinTails}
                />
                <h1>{this.state.winner} wins!</h1>
              </div>
            )}
          {this.state.flipping && <h1>Flipping</h1>}
        </div>
        <div className="section enemy">
          {this.state.enemy && (
            <div className="inner">
              <img
                alt={
                  this.state.enemy.heads
                    ? 'Enemy coin with side heads'
                    : 'Enemy coin with side tails'
                }
                src={this.state.enemy.heads ? coinHeads : coinTails}
              />
              <h1>The Enemy</h1>
              <MockLockableButton
                clicked={this.state.enemy.ready}
                clickedText="Ready"
                lockedText="Flipping"
                locked={this.state.flipping}>
                Not Ready
              </MockLockableButton>
              {this.state.winner && !this.state.winStatus && (
                <h1>Winner!</h1>
              )}
            </div>
          )}
        </div>

        {/*this.state.winner && <h2>Winner: {this.state.winner}</h2>}
        {this.state.winStatus && <h1>Winner</h1>*/}
      </div>
    );
  }
}

export default Game;
