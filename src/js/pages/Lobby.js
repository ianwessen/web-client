// The default screen a logged in player sees

import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import Loading from '../components/loading';

export default class LobbyPage extends React.Component {
  createLobbyRow(game) {
    return (
      <tr key={game.id}>
        <td>
          <a className="button is-outlined" href="#">
            Join
          </a>
        </td>
        <td>{game.id}</td>
        <td>{game.players[0].id}</td>
        <td>{game.players[1].id}</td>
      </tr>
    );
  }

  createLobbyTable(data) {
    return (
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th> </th>
            <th>Game ID</th>
            <th>⚫️ Player ID</th>
            <th>⚪️ Player ID</th>
          </tr>
        </thead>
        <tbody>{data.games.map(this.createLobbyRow)}</tbody>
      </table>
    );
  }

  render() {
    return (
      <section className="page page--home">
        <div className="hero hero--home">
          <div className="hero-body">
            <h3 className="title is-2">Lobby</h3>
            <p className="subtitle">Create a game or find one to join</p>
          </div>
        </div>

        <div className="hero is-dark hero--home">
          <div className="hero-body">
            <h3 className="title is-2">New game</h3>
            <button className="button is-white is-outlined">Create game</button>
          </div>
        </div>

        <div className="hero hero--home">
          <div className="hero-body">
            <h3 className="title is-2">Current games</h3>
          </div>
        </div>
        <div className="columns">
          <Query query={GET_GAMES}>
            {({ loading, error, data }) => {
              if (loading) return <Loading />;
              if (error) return <p>Error!!!</p>;
              return this.createLobbyTable(data);
            }}
          </Query>
        </div>
      </section>
    );
  }
}

const GET_GAMES = gql`
  {
    games {
      id
      status
      players {
        id
        user {
          id
          username
        }
      }
    }
  }
`;
