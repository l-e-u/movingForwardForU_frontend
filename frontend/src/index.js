import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { JobsContextProvider } from './context/JobsContext.js';
import { StatusesContextProvider } from './context/StatusesContext.js'
import { ContactsContextProvider } from './context/ContactsContext.js';
import { AuthContextProvider } from './context/AuthContext.js';
import { UsersContextProvider } from './context/UsersContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UsersContextProvider>
        <StatusesContextProvider>
          <ContactsContextProvider>
            <JobsContextProvider>
              <App />
            </JobsContextProvider>
          </ContactsContextProvider>
        </StatusesContextProvider>
      </UsersContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
