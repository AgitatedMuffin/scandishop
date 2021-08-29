import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {
  ApolloProvider,
} from "@apollo/client";

import client from './Data/Providers/ApolloClient'


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


