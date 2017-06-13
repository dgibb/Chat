import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Footer } from '../Components/Footer';
import { Header } from '../Components/Header';

export class LoginPage extends React.Component {

  constructor() {
    super();
    this.state = {
      loginStatus: 'initial',
      loginMessage: 'Please Choose a Username',
    }
    this.sendUsername = this.sendUsername.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.socket.emit('logout-if-not')

    this.props.socket.on('login-response', (response, message) => {
      this.setState({ loginStatus: response, loginMessage: message });
    });
  }

  sendUsername() {
    const username = document.getElementById('username-input').value;
    this.props.socket.emit('login-request', username);
  }

  render() {
    if (this.state.loginStatus === 'approved') {
      return (<Redirect push to="/Lobby" />);
    }

    return (

      <div className="content">

        <Header />

        <div id="middle-content" className="row grey1">
          <div id="login-box" className="jumbotron grey2">
            <h1>Login</h1>
            <p>{this.state.loginMessage}</p>
            <input id="username-input" type="text" placeholder=" Enter Username" name="uname" maxLength="16" required />
            <button onClick={this.sendUsername}type="submit">Login</button>
          </div>
        </div>

        <Footer />

      </div>

    );
  }
}

LoginPage.propTypes = {
  socket: PropTypes.object.isRequired,
};
