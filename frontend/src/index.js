import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { JobsContextProvider } from './context/JobsContext.js';
import { MyJobsContextProvider } from './context/MyJobsContext.js';
import { StatusesContextProvider } from './context/StatusesContext.js'
import { ContactsContextProvider } from './context/ContactsContext.js';
import { AuthContextProvider } from './context/AuthContext.js';
import { UsersContextProvider } from './context/UsersContext';
import { VehiclesContextProvider } from './context/VehiclesContext.js';
import { ActionsContextProvider } from './context/ActionsContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <VehiclesContextProvider>
        <UsersContextProvider>
          <ActionsContextProvider>
            <StatusesContextProvider>
              <ContactsContextProvider>
                <JobsContextProvider>
                  <MyJobsContextProvider>
                    <App />
                  </MyJobsContextProvider>
                </JobsContextProvider>
              </ContactsContextProvider>
            </StatusesContextProvider>
          </ActionsContextProvider>
        </UsersContextProvider>
      </VehiclesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
