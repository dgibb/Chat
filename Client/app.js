import React from 'react';
import ReactDOM from 'react-dom';
import { Chat } from './chat';

const app = document.getElementById('app');
const socket = window.io('http://localhost:5000');

ReactDOM.render(
  <Chat socket={socket} />,
   app);
