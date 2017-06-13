import React from 'react';
import { Redirect } from 'react-router';

export class RedirectPage extends React.Component {

  render() {
    return (
      <Redirect to="/" />
    );
  }
}
