import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// hooks
import { useLogout } from '../hooks/useLogout.js';

// components
import ActionButton from './ActionButton.js'

const NavMenu = ({ selectedLink, setSelectedLink, setShowThisNav, user }) => {
    const links = [
        { name: 'My Jobs', path: '/', icon: 'bi-list-check' },
        { name: 'Jobs', path: '/jobs', icon: 'bi-view-list' },
        { name: 'Contacts', path: '/contacts', icon: 'bi-person-vcard-fill' },
        { name: 'Statuses', path: '/statuses', icon: 'bi-tags-fill' },
        { name: 'Users', path: '/users', icon: 'bi-people-fill' },
        { name: 'Fees', path: '/fees', icon: 'bi-currency-dollar' },
    ];
    const { logout } = useLogout();
    const isAdmin = user?.isAdmin;

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        }
    });

    return (
        <nav className='position-fixed d-flex top-0 start-0 w-100 h-100 menu'>
            <div className='theme-light d-flex flex-column w-lg-25 w-75 w-sm-50 p-4 overflow-auto'>
                {user &&
                    <div className='border-bottom py-3'>
                        <p className='text-center m-0'>{user.firstName}</p>
                    </div>
                }

                {isAdmin && links.map((link, index) => {
                    return (
                        <Link
                            key={index}
                            to={link.path}
                            className={(selectedLink === index ? 'selected' : '') + ' text-decoration-none text-reset my-4 py-2 px-4'}
                            onClick={() => {
                                setSelectedLink(index);
                                setShowThisNav(false);
                            }}>
                            <i className={'pe-3 bi ' + link.icon}></i><span>{link.name}</span>
                        </Link>
                    )
                })
                }

                {/* LOGOUT BUTTON */}
                <ActionButton
                    alignX='center'
                    alignY='bottom'
                    handleOnClick={() => {
                        setShowThisNav(false);
                        logout();
                    }}
                    text='Logout'
                />
            </div>
            {/* on smaller screens, this area is clicked to close the nav menu */}
            <div className='flex-grow-1 h-100 background' onClick={() => setShowThisNav(false)}></div>
        </nav>
    );
};

export default NavMenu;