import React from 'react';
import PropTypes from 'prop-types';

export class CreateRoom extends React.Component {

  constructor() {
    super();
    this.state = {
      room: '',
      serverResponseMessage: '',
    };
    this.sendRoomName = this.sendRoomName.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('create-room-response', (serverResponseMessage, room) => {
      this.setState({ serverResponseMessage: serverResponseMessage, room: room });
    });
  }

  clickHandler() {
    const slider = document.getElementById('new-room-slider');
    slider.style.left = 'calc(5% - 2.5px)';
  }

  sendRoomName() {
    const roomName = document.getElementById('room-name-input').value;
    const publicPrivate = (document.getElementById('radio-private').checked) ? 'private' : 'public';
    this.props.socket.emit('create-room-request', roomName, publicPrivate);
  }

  render() {

    switch (this.state.serverResponseMessage) {

      case '':
        return (
          <div className="new-room col-lg-6" onClick={this.clickHandler} >
            <div id="new-room-container" className="well white">
              <div className="vert-center" >
                <h2>New Room</h2>
                <p>Click Here to create a new Room</p>
              </div>
              <div id="new-room-slider" className="slider">
                <div className="vert-center" >
                  <div className="row">
                    <h2>Create a Room</h2>
                  </div>
                  <div className="row">
                    <form>
                      <div className="col-lg-6 radio-button-left">
                        <input
                          type="radio"
                          name="gender"
                          value="public"
                          id="radio-public"
                          defaultChecked="checked"
                        />
                         Public <br />
                      </div>
                      <div className="col-lg-6 radio-button-right">
                        <input
                          type="radio"
                          name="gender"
                          value="private"
                          id="radio-private"
                        />
                         Private <br />
                      </div>
                    </form>
                  </div>
                  <div className="row">
                    <input
                      id="room-name-input"
                      type="text"
                      placeholder=" Enter Room Name"
                      name="rname"
                      maxLength="16"
                      required
                    />
                    <button onClick={this.sendRoomName}type="submit">Create</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:

        return (
          <div className="new-room col-lg-6" onClick={this.clickHandler} >
            <div id="new-room-container" className="well white">
              <div className="vert-center" >
                <h2>New Room</h2>
                <p>Click Here to create a new Room</p>
              </div>
              <div id="new-room-slider" className="slider">
                <div className="vert-center" >
                  <div className="row">
                    <h2>Create a Room</h2>
                    <p className="server-response-message">*{this.state.serverResponseMessage}*</p>
                  </div>
                  <div className="row">
                    <form>
                      <div className="col-lg-6 radio-button-left">
                        <input
                          type="radio"
                          name="gender"
                          value="public"
                          id="radio-public"
                        />
                         Public <br />
                      </div>
                      <div className="col-lg-6 radio-button-right">
                        <input
                          type="radio"
                          name="gender"
                          value="private"
                          id="radio-private"
                        />
                         Private <br />
                      </div>
                    </form>
                  </div>
                  <div className="row">
                    <input
                      id="room-name-input"
                      type="text"
                      placeholder=" Enter Room Name"
                      name="rname"
                      maxLength="16"
                      required
                    />
                    <button onClick={this.sendRoomName}type="submit">Create</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
}

CreateRoom.propTypes = {
  socket: PropTypes.object.isRequired,
};
