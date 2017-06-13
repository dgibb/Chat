import React from 'react';
import PropTypes from 'prop-types';

export class User extends React.Component {

  render() {
    const messageStyle = {
      backgroundColor: this.props.color
    };

    return (
      <div id="user" style={messageStyle} >
        <strong>{this.props.name}</strong>
      </div>
    );
  }
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
