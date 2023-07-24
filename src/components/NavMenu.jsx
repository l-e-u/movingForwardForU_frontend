import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useLogout } from '../hooks/useLogout';

// components
import ActionButton from './ActionButton'

const NavMenu = ({ selectedLink, setSelectedLink, setShowThisNav, user }) => {
   const links = [
      { name: 'My Jobs', path: '/', icon: 'bi-list-check' },
      { name: 'Jobs', path: '/jobs', icon: 'bi-view-list' },
      { name: 'Contacts', path: '/contacts', icon: 'bi-person-vcard' },
      { name: 'Statuses', path: '/statuses', icon: 'bi-tags' },
      { name: 'Users', path: '/users', icon: 'bi-people' },
      { name: 'Fees', path: '/fees', icon: 'bi-currency-dollar' },
      { name: 'Archives', path: '/archives', icon: 'bi-archive' },
   ];
   const { logout } = useLogout();
   const isAdmin = user?.isAdmin;

   return (
      <nav aria-label='Pages navigation' className='d-flex flex-column text-secondary pt-5' style={{ width: '100px', minHeight: '800px' }}>

         {isAdmin && links.map((link, index) => {
            return (
               <Link
                  key={index}
                  to={link.path}
                  className={`text-reset p-2 ${selectedLink === index ? 'selected' : ''}`}
                  onClick={() => {
                     setSelectedLink(index);
                  }}>
                  <div className='navIcon rounded-circle mx-auto d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                     <i className={`bi ${link.icon}`}></i>
                  </div>
               </Link>
            )
         })
         }

         {/* LOGOUT BUTTON */}
         <button
            className='border-0 text-reset mt-auto'
            style={{ backgroundColor: 'transparent' }}
            onClick={logout}
            type='button'
         >
            <i className='bi bi-box-arrow-right'></i>
         </button>
      </nav>
   );
};

export default NavMenu;