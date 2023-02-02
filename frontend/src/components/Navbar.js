import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useLogout } from '../hooks/useLogout.js';
import NavbarAdmin from './NavbarAdmin.js';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const isAdmin = user ? user.isAdmin : null;

    return (
        <header>
            <div className='container'>
                <Link to='/'>
                    <h1>Moving Forward</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.username}</span>
                            <button onClick={logout}>Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to='/login'>Login</Link>
                            <Link to='/signup'>Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
            {/* Admin navigation */}
            {isAdmin && (
                <NavbarAdmin />
            )}
        </header>
    )
}

export default Navbar;