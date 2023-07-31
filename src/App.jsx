import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// hooks
import { useAuthContext } from './hooks/useAuthContext';

// components
import Banner from './components/Banner.jsx';
import SideNavMenu from './components/SideNavMenu.jsx';

// pages
import Archives from './pages/Archives.jsx';
import Contacts from './pages/Contacts.jsx';
import Fees from './pages/Fees.jsx';
import Jobs from './pages/Jobs.jsx'
import Login from './pages/Login.jsx';
import MyJobs from './pages/MyJobs.jsx';
import Statuses from './pages/Statuses.jsx';
import Users from './pages/Users.jsx';
import Verify from './pages/Verify.jsx';

function App() {
   const { user } = useAuthContext();

   const [archiveFilters, setArchiveFilters] = useState({});
   const [jobFilters, setJobFilters] = useState({});
   const [myJobFilters, setMyJobFilters] = useState({});
   const [selectedLink, setSelectedLink] = useState('My Jobs')

   useEffect(() => {
      // reset state when user changes
      setJobFilters({});
      setMyJobFilters({});
      setSelectedLink('My Jobs');
   }, [user])

   return (
      <div className='App'>
         <BrowserRouter>
            {user && <SideNavMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} />}
            <Routes>
               <Route
                  path='/'
                  element={
                     user ?
                        <MyJobs filters={myJobFilters} setFilters={setMyJobFilters} selectedLink={selectedLink} setSelectedLink={setSelectedLink} /> :
                        <Navigate to='/login' />}
               />
               <Route
                  path='/jobs'
                  element={
                     user ?
                        <Jobs filters={jobFilters} setFilters={setJobFilters} selectedLink={selectedLink} setSelectedLink={setSelectedLink} /> :
                        <Navigate to='/login' />
                  }
               />
               <Route
                  path='/statuses'
                  element={user ? <Statuses /> : <Navigate to='/login' />}
               />
               <Route
                  path='/contacts'
                  element={user ? <Contacts /> : <Navigate to='/login' />}
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
                  element={user ? <Archives filters={archiveFilters} setFilters={setArchiveFilters} /> : <Navigate to='/login' />}
               />
               <Route
                  path='/login'
                  element={!user ? <Login /> : <Navigate to='/' />}
               />
               <Route
                  path='/verify/:emailToken/:name/:resetPassword'
                  element={!user ? <Verify /> : <Navigate to='/login' />}
               />
            </Routes>
            {/* <footer className='d-flex flex-wrap justify-content-center text-center text-secondary mt-3 px-4 pb-3 w-100 fs-smaller'>
                  <span className='mx-1'><i className='bi bi-c-circle'></i> {new Date().getFullYear()} Moving Forward, LLC.</span><span>All Rights Reserved</span>
               </footer> */}
         </BrowserRouter>
      </div>
   );

   return (
      <div className='App'>
         <BrowserRouter>
            <Banner setShowSideNavMenu={setShowSideNavMenu} setSelectedLink={setSelectedLink} user={user} />
            <div className='mx-auto my-0 maxWidth1400px d-flex'>
               {showSideNavMenu && <SideNavMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} setShowThisNav={setShowSideNavMenu} user={user} />}
               <Routes>
                  <Route
                     path='/'
                     element={user ? <MyJobs filters={myJobFilters} setFilters={setMyJobFilters} /> : <Navigate to='/login' />}
                  />
                  <Route
                     path='/jobs'
                     element={user ? <Jobs filters={jobFilters} setFilters={setJobFilters} /> : <Navigate to='/login' />}
                  />
                  <Route
                     path='/statuses'
                     element={user ? <Statuses /> : <Navigate to='/login' />}
                  />
                  <Route
                     path='/contacts'
                     element={user ? <Contacts /> : <Navigate to='/login' />}
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
                     element={user ? <Archives filters={archiveFilters} setFilters={setArchiveFilters} /> : <Navigate to='/login' />}
                  />
                  <Route
                     path='/login'
                     element={!user ? <Login /> : <Navigate to='/' />}
                  />
                  <Route
                     path='/verify/:emailToken/:name/:resetPassword'
                     element={!user ? <Verify /> : <Navigate to='/login' />}
                  />
                  <footer className='d-flex flex-wrap justify-content-center text-center text-secondary mt-3 px-4 pb-3 w-100 smallPrint'>
                     <span className='mx-1'><i className='bi bi-c-circle'></i> {new Date().getFullYear()} Moving Forward, LLC.</span><span>All Rights Reserved</span>
                  </footer>
               </Routes>
            </div>
         </BrowserRouter>
      </div>
   );
}

export default App;
