import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './samples/node-api';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

window.postMessage({ payload: 'removeLoading' }, '*');
