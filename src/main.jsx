import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './samples/node-api';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

window.postMessage({ payload: 'removeLoading' }, '*');
