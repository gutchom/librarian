import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Scanner from './feature/Scanner';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Scanner />
  </React.StrictMode>,
);
