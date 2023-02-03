import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext.js';

// pages & components
import MyJobs from './pages/MyJobs.js';
import AllJobs from './pages/AllJobs.js'
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Navbar from './components/Navbar.js'
import Statuses from './pages/Statuses.js';
import Contacts from './pages/Contacts.js';
import Users from './pages/Users.js';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route
              path='/'
              element={user ? <MyJobs /> : <Navigate to='/login' />}
            />
            <Route
              path='/alljobs'
              element={<AllJobs />}
            />
            <Route
              path='/statuses'
              element={<Statuses />}
            />
            <Route
              path='/contacts'
              element={<Contacts />}
            />
            <Route
              path='/users'
              element={<Users />}
            />
            <Route
              path='/login'
              element={!user ? <Login /> : <Navigate to='/' />}
            />
            <Route
              path='/signup'
              element={!user ? <Signup /> : <Navigate to='/' />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
