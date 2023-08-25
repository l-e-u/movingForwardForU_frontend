import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useAuthContext } from './hooks/useAuthContext';

// components
import NavMenu from './components/NavMenu.jsx';
import Page from './components/Page';

// pages
import Archives from './pages/Archives.jsx';
import Contacts from './pages/Contacts.jsx';
import Fees from './pages/Fees.jsx';
import Dispatch from './pages/Dispatch.jsx'
import Login from './pages/Login.jsx';
import Jobs from './pages/Jobs.jsx';
import Statuses from './pages/Statuses.jsx';
import Users from './pages/Users.jsx';
import Verify from './pages/Verify.jsx';

function App() {
   const paginationDefaults = {
      pages: {
         current: 1,
         total: 1

      },
      results: {
         limit: 10,
         total: 0,
      }
   };

   const { user } = useAuthContext();

   const [selectedLink, setSelectedLink] = useState('Jobs');
   const [paginations, setPaginations] = useState({
      archive: paginationDefaults,
      contacts: paginationDefaults,
      dispatch: paginationDefaults,
      jobs: paginationDefaults,
   });
   const [filters, setFilters] = useState({
      archives: {},
      dispatch: {},
      jobs: {}
   });

   const setThisFilter = (filter) => {
      setFilters({
         ...filters,
         [selectedLink.toLocaleLowerCase()]: filter
      });
   };

   const setThisPagination = (pagination) => {
      setPaginations({
         ...paginations,
         [selectedLink.toLowerCase()]: pagination
      });
   };

   return (
      <div className='App'>
         <AnimatePresence mode='wait'>
            <BrowserRouter>
               {user && <NavMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} />}
               <Page>
                  <Routes>
                     <Route
                        path='/'
                        element={
                           user ?
                              <Jobs
                                 filters={filters.jobs}
                                 pagination={paginations.jobs}
                                 setFilters={setThisFilter}
                                 setPagination={setThisPagination}
                              />
                              :
                              <Navigate to='/login' />
                        }
                     />
                     <Route
                        path='/dispatch'
                        element={
                           user ?
                              <Dispatch
                                 filters={filters.dispatch}
                                 pagination={paginations.dispatch}
                                 setFilters={setThisFilter}
                                 setPagination={setThisPagination}
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
                                 pagination={paginations.contacts}
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
                              <Archives
                                 filters={filters.archives}
                                 pagination={paginations.archive}
                                 setFilters={setThisFilter}
                                 setPagination={setThisPagination}
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
                  </Routes>
               </Page>
               {/* <footer className='d-flex flex-wrap justify-content-center text-center text-secondary mt-3 px-4 pb-3 w-100 fs-smaller'>
                  <span className='mx-1'><i className='bi bi-c-circle'></i> {new Date().getFullYear()} Moving Forward, LLC.</span><span>All Rights Reserved</span>
               </footer> */}
            </BrowserRouter>
         </AnimatePresence>
      </div>
   );
}

export default App;
