import React, { Component } from 'react';
import { render } from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-client-preset';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import { AUTH_TOKEN } from './utils/constants';

import Header from './components/header';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import LobbyPage from './pages/Lobby';
import GamePage from './pages/Game';
import RegisterPage from './pages/Register';
import FourOhFourPage from './pages/FourOhFour';

const httpLink = new HttpLink({
  // uri: `https://go-stop.live/api`,
  // uri: `http://localhost:4000/api`,
  //uri: process.env['API_URL'],
  uri: `https://go-stop.herokuapp.com/api/graphiql`,
});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);
// const httpLinkWithAuthToken = httpLink;

const client = new ApolloClient({
  // uri: 'https://go-stop.live/api',
  // uri: 'http://localhost:4000/api',
  //uri: process.env['API_URL'],
  uri: `https://go-stop.herokuapp.com/api/graphiql`,

  link: httpLinkWithAuthToken,
  cache: new InMemoryCache(),
});

class Main extends Component {
  render() {
    return (
      <main className="main container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/lobby" component={LobbyPage} />
          <Route path="/game/:id" component={GamePage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={FourOhFourPage} />
        </Switch>
      </main>
    );
  }
}

import AuthContext from './utils/AuthContext';

class AuthProvider extends Component {
  constructor(props) {
    super();
    this.state = {
      currentUser: null,
      updateCurrentUser: this.updateCurrentUser,
    };
  }

  updateCurrentUser(username) {
    // this.setState({ currentUser: username });
    // console.log(state);
    console.log(this.state);
  }

  render() {
    return (
      <AuthContext.Provider value={{ state: this.state }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

class App extends Component {
  // state {
  //   currentUser: null,
  // };

  render() {
    return (
      <div className="app">
        <Header />
        <Main />
      </div>
    );
  }
}

require('../stylesheets/index.scss');

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ApolloProvider>,

  document.getElementById('root')
);
