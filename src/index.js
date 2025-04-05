// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Replace with your actual Clerk publishable key
const clerkPubKey = 'pk_test_c291Z2h0LXJhY2VyLTIuY2xlcmsuYWNjb3VudHMuZGV2JA';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </React.StrictMode>
);