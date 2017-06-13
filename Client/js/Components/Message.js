import React from 'react';
import PropTypes from 'prop-types';

export class Message extends React.Component {

  render() {

    const messageStyle = {
      backgroundColor: this.props.color
    };

    if (this.props.align === 'center') {
      return (
        <div id="message" className="col-lg-12 server-broadcast" style={messageStyle} >
          <div id="message-text" className="row">
            {this.props.message}
          </div>
        </div>
      );
    } else {
      const messageClass = (this.props.align === 'right') ? 'col-lg-7 right' : 'col-lg-7 left';

      return (
        <div id="message" className={messageClass} style={messageStyle} >
          <div id="author" className="row">
            <strong>{this.props.author}</strong>
          </div>
          <div id="message-text" className="row">
            {this.props.message}
          </div>
        </div>
      );
    }
  }
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  align: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};
