import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useLogout } from '../hooks/useLogout.js';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

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
        </header>
    )
}

export default Navbar;