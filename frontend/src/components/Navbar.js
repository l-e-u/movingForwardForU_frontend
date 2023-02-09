import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useLogout } from '../hooks/useLogout.js';

const Navbar = () => {
    const [selected, setSelected] = useState(0);
    const links = [
        { name: 'My Jobs', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Contacts', path: '/contacts' },
        { name: 'Statuses', path: '/statuses' },
        { name: 'Users', path: '/users' },
    ];
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const isAdmin = user ? user.isAdmin : null;

    return (
        <header className='theme-light'>
            <div className='d-flex p-3 align-items-center justify-content-between'>
                <Link to='/' className='text-reset text-decoration-none'>
                    <h1 className='m-0'>Moving Forward</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.firstName}</span>
                            <button
                                type='button'
                                className='btn btn-danger btn-sm'
                                onClick={logout}
                            >Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to='/login' className='px-1 text-decoration-none text-reset'>Login</Link>
                            <Link to='/signup' className='px-1 text-decoration-none text-reset'>Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
            {/* Admin navigation */}
            {isAdmin && (
                <nav className='admin d-flex'>
                    {links.map((link, index) => {
                        return (
                            <Link
                                key={index}
                                to={link.path}
                                className={(selected === index ? 'selected' : '') + ' text-decoration-none text-reset'}
                                onClick={() => setSelected(index)}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
            )}
        </header>
    )
}

export default Navbar;