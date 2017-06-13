import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LoginPage } from './js/Pages/Login';
import { LobbyPage } from './js/Pages/Lobby';
import { RoomPage } from './js/Pages/Room';
import { RedirectPage } from './js/Pages/Redirect';

export class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this.props.socket.on('confirm-username', (data) => {
      console.log('chat.setstate:', data);
      this.setState({ username: data });
    });
  }

  render() {
    const loginPage = () => {
      return (
        <LoginPage
          socket={this.props.socket}
        />
      );
    };

    const lobbyPage = () => {
      return (
        <LobbyPage
          socket={this.props.socket}
        />
      );
    };

    const roomPage = () => {
      return (
        <RoomPage
          username={this.state.username}
          socket={this.props.socket}
        />
      );
    };

    return (
      <Router>
        <div>
          <Route exact path="/" render={loginPage} />
          <Route path="/Lobby" render={lobbyPage} />
          <Route path="/Room/*" render={roomPage} />
          <Route path="*" component={RedirectPage} />
        </div>
      </Router>
    );
  }
}

Chat.propTypes = {
  socket: React.PropTypes.object.isRequired,
};
