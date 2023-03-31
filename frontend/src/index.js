import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext.js';
import { ArchivesContextProvider } from './context/ArchivesContext';
import { ContactsContextProvider } from './context/ContactsContext.js';
import { FeesContextProvider } from './context/FeesContext.js';
import { JobsContextProvider } from './context/JobsContext.js';
import { MyJobsContextProvider } from './context/MyJobsContext.js';
import { StatusesContextProvider } from './context/StatusesContext.js'
import { UsersContextProvider } from './context/UsersContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <FeesContextProvider>
        <UsersContextProvider>
          <StatusesContextProvider>
            <ContactsContextProvider>
              <JobsContextProvider>
                <MyJobsContextProvider>
                  <ArchivesContextProvider>
                    <App />
                  </ArchivesContextProvider>
                </MyJobsContextProvider>
              </JobsContextProvider>
            </ContactsContextProvider>
          </StatusesContextProvider>
        </UsersContextProvider>
      </FeesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
