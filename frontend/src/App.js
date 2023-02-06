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
  let Jobs;

  console.log(user)

  if (user) {
    Jobs = user.isAdmin ? AllJobs : MyJobs;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route
              path='/'
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
