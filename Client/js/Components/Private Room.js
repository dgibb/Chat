import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

export class PrivateRoom extends React.Component {

  constructor() {
    super();
    this.state = {
      room: '',
      serverResponseMessage: '',
    };
    this.sendPrivateRoom = this.sendPrivateRoom.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('join-private-response', (serverResponseMessage, room) => {
      this.setState({ serverResponseMessage: serverResponseMessage, room: room });
    });
  }

  clickHandler() {
    const slider = document.getElementById('private-room-slider');
    slider.style.left = 'calc(5% + 2.5px)';
  }

  sendPrivateRoom() {
    const roomname = document.getElementById('private-room-input').value;
    this.props.socket.emit('join-private-room', roomname);
  }

  render() {

    switch (this.state.serverResponseMessage) {

      case '':
        return (
          <div className="private-room col-lg-6" onClick={this.clickHandler}>
            <div id="new-room-container" className="well white">
              <div className="vert-center" >
                <h2>Private Room</h2>
                <p>Click Here to join a Private Room</p>
              </div>
              <div id="private-room-slider" className="slider">
                <div className="vert-center" >
                  <div className="row">
                    <h2>Join a Private Room</h2>
                  </div>
                  <div className="row">
                    <input
                      id="private-room-input"
                      type="text"
                      placeholder=" Enter Room Name"
                      name="rname"
                      maxLength="16"
                      required
                    />
                    <button onClick={this.sendPrivateRoom}type="submit">Join</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accepted':
        const redirect = '/Room/' + this.state.room;
        return (<Redirect push to={redirect} />);

      default:
        return (
          <div className="private-room col-lg-6" onClick={this.clickHandler}>
            <div id="new-room-container" className="well white">
              <div className="vert-center" >
                <h2>Private Room</h2>
                <p>Click Here to join a Private Room</p>
              </div>
              <div id="private-room-slider" className="slider">
                <div className="vert-center" >
                  <div className="row">
                    <h2>Join a Private Room</h2>
                    <p className="server-response-message">{this.state.serverResponseMessage}</p>
                  </div>
                  <div className="row">
                    <input
                      id="private-room-input"
                      type="text"
                      placeholder=" Enter Room Name"
                      name="rname"
                      maxLength="16"
                      required
                    />
                    <button onClick={this.sendPrivateRoom}type="submit">Join</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
}

PrivateRoom.propTypes = {
  socket: PropTypes.object.isRequired,
};
