import React from 'react';
import ReactDOM from 'react-dom/client';
import CustomRouter from './components/Router/CustomRouter';
import history from './utils/history';
import App from './App';

const rootElement = document.getElementById('root')!;

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CustomRouter history={history}>
      <App />
    </CustomRouter>
  </React.StrictMode>
);