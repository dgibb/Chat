import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Footer } from '../Components/Footer';
import { Header } from '../Components/Header';
import { Message } from '../Components/Message';
import { User } from '../Components/User';


export class RoomPage extends React.Component {

constructor() {
  super();
  this.state = {
    messages: [],
    users: [],
    redirect: false,
  };
  this.submitMessage = this.submitMessage.bind(this);
}

  componentWillMount() {
    this.props.socket.emit('room-check');
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.socket.on('room-confirmation', (redirect) => {
      this.setState({ redirect: redirect });
    });

    this.props.socket.on('room-confirmation', (redirect) => {
      this.setState({ redirect: redirect });
    });

    this.props.socket.on('new-message', (message) => {
      message.align = (message.author === this.props.username) ? 'right' : 'left';
      this.state.messages.push(message);
      this.setState({ messages: this.state.messages });
      const messageContainer = document.getElementById('message-container');
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    this.props.socket.on('update-users', (users) => {
      this.state.users = users;
      this.setState({ users: this.state.users });
    });

    this.props.socket.on('update-messages', (messages) => {
      this.state.messages = messages;
      this.setState({ messages: this.state.messages });
    });

    this.props.socket.on('user-joined-room', (username) => {
      const txt = username + ' has joined the room';
      const msg = { author: 'server-broadcast', color: '#ffffff', text: txt, align: 'center' };
      this.state.messages.push(msg);
      this.setState({ messages: this.state.messages });
    });

    this.props.socket.on('user-left-room', (username) => {
      const txt = username + ' has left the room';
      const msg = { author: 'server-broadcast', color: '#ffffff', text: txt, align: 'center' };
      this.state.messages.push(msg);
      this.setState({ messages: this.state.messages });
    });
  }

  componentWillUnmount() {
    if (!this.state.redirect) {
      this.props.socket.emit('leave-room');
    }
  }

  submitMessage() {
    const messageText = document.getElementById('message-box');
    this.props.socket.emit('submit-message', messageText.value);
    messageText.value = '';
  }

  render() {
    if (this.state.redirect === 'Login') {
      return (
        <Redirect to="/" />
      );
    } else if (this.state.redirect === 'Lobby') {
      return (
        <Redirect to="/Lobby" />
      );
    }

    const userArray = this.state.users.map(
      (user, i) => (
        <User
          key={i}
          name={user.username}
          color={user.color}
        />));

    const messageArray = this.state.messages.map(
      (message, i) => (
        <Message
          key={i}
          author={message.author}
          color={message.color}
          message={message.text}
          align={message.align}
        />));

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
            <div id="message-column"className="row" >
              <div id="message-container"className="well white">
                {messageArray}
              </div>
            </div>
            <div id="write-message" className="row">
              <div className=" text-area col-lg-11" >
                <textarea id="message-box" />
              </div>
              <div className="send-button col-lg-1" >
                <button onClick={this.submitMessage} className="send">Send</button>
              </div>
            </div>
          </div>
        </div>

        <Footer />

      </div>

    );
  }
}

RoomPage.propTypes = {
  socket: PropTypes.object.isRequired,
};
