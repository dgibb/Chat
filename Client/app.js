import React from 'react';
import ReactDOM from 'react-dom';
import { Chat } from './chat';

const app = document.getElementById('app');
const socket = window.io('https://safe-depths-19563.herokuapp.com/');

ReactDOM.render(
  <Chat socket={socket} />,
   app);
