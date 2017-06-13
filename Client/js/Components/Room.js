import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export class Room extends React.Component {

  constructor() {
    super();
    this.joinRoom = this.joinRoom.bind(this);
  }

  joinRoom() {
    this.props.socket.emit('join-room', this.props.roomname);
  }

  render() {

    const extension = "/Room/" + this.props.roomname

    return (
      <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-6 room white">
        <div onClick={this.joinRoom} className="room-container grey1">
          <Link to={extension}>
            <div className="room-text">
              <h1>{this.props.roomname}</h1>
              <div className="room-description">
                <p>Active Users: {this.props.activeUsers}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

Room.propTypes = {
  socket: PropTypes.object.isRequired,
  roomname: PropTypes.string.isRequired,
  activeUsers: PropTypes.number.isRequired,
};
