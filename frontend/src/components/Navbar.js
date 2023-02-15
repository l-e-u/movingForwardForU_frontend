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

    // local state
    const [showMenu, setShowMenu] = useState(false);

    const handleLogoutClick = () => {
        setShowMenu(false);
        logout();
    }

    return (
        <header className='theme-light'>
            <div className='d-flex p-3 align-items-center justify-content-between'>
                {user && <h1 className='m-0'><i className="bi bi-list" onClick={() => setShowMenu(true)}></i></h1>}
                <Link to='/' className='text-reset text-decoration-none'>
                    <h1 className='m-0'>Moving Forward</h1>
                </Link>
            </div>

            {/* new menu dev */}
            <nav
                className={'position-fixed d-flex top-0 start-0 w-100 h-100 menu' + (showMenu ? ' show' : ' d-none')}
            >
                <div className='theme-light d-flex flex-column w-75 p-4 overflow-auto'>
                    {user && <div className='border-bottom py-3'>
                        <p className='text-center m-0'>{user.firstName}</p>
                    </div>
                    }

                    {isAdmin && links.map((link, index) => {
                        return (
                            <Link
                                key={index}
                                to={link.path}
                                className={(selected === index ? 'selected' : '') + ' text-decoration-none text-reset my-4 py-2 px-4'}
                                onClick={() => setSelected(index)}
                            >
                                {link.name}
                            </Link>
                        )
                    })
                    }
                    <button
                        type='button'
                        className='d-flex mx-auto mt-auto btn btn-danger btn-sm rounded-pill px-3'
                        onClick={handleLogoutClick}
                    >Log out</button>
                </div>
                <div className='w-25 h-100 background' onClick={() => setShowMenu(false)}></div>
            </nav>
        </header>
    )
}

export default Navbar;