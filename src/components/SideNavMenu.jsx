import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useLogout } from '../hooks/useLogout';

const SideNavMenu = ({ selectedLink, setSelectedLink }) => {
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

   const navClasses = 'sideNavMenu position-fixed d-none d-md-flex flex-column text-secondary top-0 start-0 pt-5 pb-4 border-end h-100';
   // z-index number comes from bootstrap v5 docs
   // width is set in index.css
   const navStyles = { minHeight: '800px', zIndex: '1031' };

   // styles for links
   const linkClasses = 'text-reset p-2';

   // styles for icons
   const iconContainerClasses = 'navIcon rounded-circle mx-auto d-flex justify-content-center align-items-center';
   const iconContainerStyles = { width: '40px', height: '40px' };

   const linksJSX = links.map((link, index) => {
      const { name } = link;

      return (
         <Link
            key={index}
            to={link.path}
            className={`${linkClasses}${selectedLink === name ? ' selected' : ''}`}
            onClick={() => setSelectedLink(name)}>
            <div className={iconContainerClasses} style={iconContainerStyles}>
               <i className={`bi ${link.icon}`}></i>
            </div>
         </Link>
      );
   });

   return (
      <nav aria-label='Pages navigation' className={navClasses} style={navStyles}>

         {/* navigation links to other pages */}
         {linksJSX}

         {/* LOGOUT BUTTON */}
         <button
            className='border-0 text-reset mt-auto'
            style={{ backgroundColor: 'transparent' }}
            onClick={logout}
            type='button'
         >
            <i className='bi bi-box-arrow-right'></i>
         </button>
      </nav >
   );
};

export default SideNavMenu;