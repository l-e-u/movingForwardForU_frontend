import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { JobsContextProvider } from './context/JobsContext.js';
import { StatusesContextProvider } from './context/StatusesContext.js'
import { ContactsContextProvider } from './context/ContactsContext.js';
import { AuthContextProvider } from './context/AuthContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StatusesContextProvider>
        <ContactsContextProvider>
          <JobsContextProvider>
            <App />
          </JobsContextProvider>
        </ContactsContextProvider>
      </StatusesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
