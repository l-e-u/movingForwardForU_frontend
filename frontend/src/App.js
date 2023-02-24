import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext.js';

// pages
import MyJobs from './pages/MyJobs.js';
import Jobs from './pages/Jobs.js'
import Login from './pages/Login.js';
import Navbar from './components/Navbar.js'
import Statuses from './pages/Statuses.js';
import Contacts from './pages/Contacts.js';
import Users from './pages/Users.js';

function App() {
  const { user } = useAuthContext();

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className='mx-auto my-0 maxWidth1400px d-flex'>
          <div className='navWillGoHere'>
          </div>
          <Routes>
            <Route
              path='/'
              element={user ? <MyJobs /> : <Navigate to='/login' />}
            />
            <Route
              path='/jobs'
              element={user ? <Jobs /> : <Navigate to='/login' />}
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
              path='/login'
              element={!user ? <Login /> : <Navigate to='/' />}
            />
          </Routes>
        </div>
      </BrowserRouter>
      <footer className='d-flex flex-wrap justify-content-center text-center text-secondary pb-3 w-100 smallPrint'>
        <span className='mx-1'>Copyright <i className='bi bi-c-circle'></i> {new Date().getFullYear()} Moving Forward, LLC.</span><span>All Rights Reserved</span>
      </footer>
    </div>
  );
}

export default App;
