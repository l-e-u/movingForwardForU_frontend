import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

// context
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ArchivesContextProvider } from './context/ArchivesContext';
import { ContactsContextProvider } from './context/ContactsContext.jsx';
import { FeesContextProvider } from './context/FeesContext.jsx';
import { JobsContextProvider } from './context/JobsContext.jsx';
import { MyJobsContextProvider } from './context/MyJobsContext.jsx';
import { StatusesContextProvider } from './context/StatusesContext.jsx'
import { UsersContextProvider } from './context/UsersContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   // <React.StrictMode>
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
   // </React.StrictMode>
);
