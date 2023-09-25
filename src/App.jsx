import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useAuthContext } from './hooks/useAuthContext';

// components
import NavMenu from './components/NavMenu.jsx';
import Page from './components/Page';

// pages
import Contacts from './pages/Contacts';
import Fees from './pages/Fees';
import Login from './pages/Login';
import JobsArchives from './pages/JobsArchives';
import JobsDispatcher from './pages/JobsDispatcher';
import JobsDriver from './pages/JobsDriver';
import Statuses from './pages/Statuses';
import Users from './pages/Users';
import Verify from './pages/Verify';
import Demo from './pages/Demo';
import NotFound404 from './pages/404';

function App() {
   const defaults_paginations = {
      pages: {
         current: 1,
         total: 1

      },
      results: {
         limit: 10,
         total: 0,
      }
   };

   const defaults_quickDateSelections = {
      archived: null,
      created: null,
      delivery: null,
      pickup: null
   };

   const { user } = useAuthContext();

   const [selectedLink, setSelectedLink] = useState('Jobs');

   const [paginations, setPaginations] = useState({
      archives: defaults_paginations,
      contacts: defaults_paginations,
      dispatch: defaults_paginations,
      jobs: defaults_paginations,
   });

   const [filters, setFilters] = useState({
      archives: {},
      contacts: {},
      dispatch: {},
      jobs: {}
   });

   const [filters_quickDateSelections, setFilters_quickDateSelections] = useState({
      archives: defaults_quickDateSelections,
      jobs: defaults_quickDateSelections,
      dispatch: defaults_quickDateSelections,
   });

   const setThisFilter = (filter) => {
      setFilters({
         ...filters,
         [selectedLink.toLowerCase()]: filter
      });
   };

   const setThisFilter_quickDateSelections = (quickDateSelections) => {
      setFilters_quickDateSelections({
         ...filters_quickDateSelections,
         [selectedLink.toLowerCase()]: quickDateSelections
      });
   };

   const setThisPagination = (pagination) => {
      setPaginations({
         ...paginations,
         [selectedLink.toLowerCase()]: pagination
      });
   };

   const showNavMenu = () => {
      const pagesWithNavMenu = ['Jobs', 'Dispatch', 'Contacts', 'Users', 'Statuses', 'Fees', 'Archives'];

      return user && pagesWithNavMenu.includes(selectedLink);
   };

   return (
      <div className='App'>
         <AnimatePresence mode='wait'>

            <BrowserRouter>
               {
                  showNavMenu() && <NavMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} />
               }

               <Page>
                  <Routes>
                     <Route
                        path='/'
                        element={
                           user ?
                              <JobsDriver
                                 filters={filters.jobs}
                                 filters_quickDateSelections={filters_quickDateSelections.jobs}
                                 pagination={paginations.jobs}
                                 setFilters={setThisFilter}
                                 setFilters_quickDateSelections={setThisFilter_quickDateSelections}
                                 setPagination={setThisPagination}
                                 showBilling={false}
                                 showMoreDocumentOptions={false}
                                 showMoreInDetails={false}
                              />
                              :
                              <Navigate to='/login' />
                        }
                     />

                     <Route
                        path='/dispatch'
                        element={
                           user ?
                              <JobsDispatcher
                                 filters={filters.dispatch}
                                 filters_quickDateSelections={filters_quickDateSelections.dispatch}
                                 pagination={paginations.dispatch}
                                 setFilters={setThisFilter}
                                 setFilters_quickDateSelections={setThisFilter_quickDateSelections}
                                 setPagination={setThisPagination}
                                 showBilling={true}
                                 showMoreDocumentOptions={true}
                                 showMoreInDetails={true}
                              />
                              :
                              <Navigate to='/login' />
                        }
                     />

                     <Route
                        path='/statuses'
                        element={user ? <Statuses /> : <Navigate to='/login' />}
                     />

                     <Route
                        path='/contacts'
                        element={
                           user ?
                              <Contacts
                                 filters={filters.contacts}
                                 pagination={paginations.contacts}
                                 setFilters={setThisFilter}
                                 setPagination={setThisPagination}
                              />
                              :
                              <Navigate to='/login' />
                        }
                     />

                     <Route
                        path='/users'
                        element={user ? <Users /> : <Navigate to='/login' />}
                     />

                     <Route
                        path='/fees'
                        element={user ? <Fees /> : <Navigate to='/login' />}
                     />

                     <Route
                        path='/archives'
                        element={
                           user ?
                              <JobsArchives
                                 filters={filters.archives}
                                 filters_quickDateSelections={filters_quickDateSelections.archives}
                                 pagination={paginations.archives}
                                 setFilters={setThisFilter}
                                 setFilters_quickDateSelections={setThisFilter_quickDateSelections}
                                 setPagination={setThisPagination}
                                 selectedLink={selectedLink}
                                 setSelectedLink={setSelectedLink}
                                 showBilling={true}
                                 showMoreDocumentOptions={true}
                                 showMoreInDetails={true}
                              />
                              :
                              <Navigate to='/login' />
                        }
                     />

                     <Route
                        path='/login'
                        element={!user ? <Login /> : <Navigate to='/' />}
                     />

                     <Route
                        path='/verify/:emailToken/'
                        element={!user ? <Verify /> : <Navigate to='/' />}
                     />

                     <Route path='/demo' element={<Demo setSelectedLink={setSelectedLink} />} />

                     {/* 404 */}
                     <Route path='/*' element={<NotFound404 setSelectedLink={setSelectedLink} />} />
                  </Routes>
               </Page>
            </BrowserRouter>
         </AnimatePresence>
      </div>
   );
}

export default App;
