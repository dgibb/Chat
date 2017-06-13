import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Footer } from '../Components/Footer';
import { Header } from '../Components/Header';
import { Room } from '../Components/Room';
import { User } from '../Components/User';
import { CreateRoom } from '../Components/Create Room';
import { PrivateRoom } from '../Components/Private Room';

export class LobbyPage extends React.Component {

  constructor() {
    super();
    this.state = {
      users: [],
      rooms: [],
      redirect: false,
    };
  }

  componentWillmount() {
    this.props.socket.emit('login-check');
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.socket.on('login-confirmation', (redirect) => {
      this.setState({ redirect: redirect });
    });

    this.props.socket.emit('lobby-request');

    this.props.socket.on('update-lobby', (rooms, users) => {
      this.setState({ rooms: rooms, users: users });
    });

    this.props.socket.on('create-room-accept', (redirect) => {
      this.setState({ redirect: redirect });
    });
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect push to={this.state.redirect} />);
    }

    const chatRooms = this.state.rooms.map(
      (room, i) => (
        <Room
          key={i}
          roomname={room.name}
          socket={this.props.socket}
          activeUsers={room.activeUsers}
        />
      )
    );

    const userArray = this.state.users.map(
      (user, i) => (
        <User
          key={i}
          name={user.username}
          color={user.color}
        />
      )
    );

    return (

      <div className="content">

        <Header />

        <div id="middle-content" className="row grey2">
          <div id="users" className="col-lg-3">
            <div id="user-column" className="well white">
              <h2>Online Users</h2>
              {userArray}
            </div>
          </div>

          <div id="messages" className="col-lg-9">
            <div id="chatrooms-column"className="row" >
              <div id="message-container"className="well white">
                <h2>Public Chat Rooms</h2>
                {chatRooms}
              </div>
            </div>
            <div id="create-join-room" className="row">
              <CreateRoom socket={this.props.socket} />
              <PrivateRoom socket={this.props.socket} />
            </div>
          </div>

        </div>

        <Footer />

      </div>

    );
  }
}

LobbyPage.propTypes = {
  socket: PropTypes.object.isRequired,
};
