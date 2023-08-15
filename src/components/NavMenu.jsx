import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useLogout } from '../hooks/useLogout';

// assets
import logo from '../assets/movingForwardArrows.svg';

const NavMenu = ({ selectedLink, setSelectedLink }) => {
   const links = [
      { name: 'Jobs', path: '/', icon: 'bi-list-check' },
      { name: 'Dispatch', path: '/dispatch', icon: 'bi-truck' },
      { name: 'Contacts', path: '/contacts', icon: 'bi-person-vcard' },
      { name: 'Statuses', path: '/statuses', icon: 'bi-tags' },
      { name: 'Users', path: '/users', icon: 'bi-people' },
      { name: 'Fees', path: '/fees', icon: 'bi-cash-coin' },
      { name: 'Archives', path: '/archives', icon: 'bi-archive' },
   ];
   const [expandMenu, setExpandMenu] = useState(false);

   const { logout } = useLogout();

   const expandCollapseVariants = {
      mount: {
         borderBottom: '1px solid var(--mainPalette7)',
         paddingBottom: '0rem',
         height: '0px',
         zIndex: '1'
      },
      animation: {
         boxShadow: '0px 1px 25px 1px var(--mainPalette7)',
         height: '300px',
         paddingBottom: '0.5rem',
         transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
            height: {
               duration: 0.25
            }
         }
      },
      unmount: {
         height: '0px',
         paddingBottom: '0rem',
         transition: {
            when: 'afterChildren',
         }
      }
   };

   const fadeInOutVariants = {
      mount: {
         opacity: 0,
      },
      animation: {
         opacity: 1
      },
      unmount: {
         opacity: 0
      }
   };


   const navLinksJSX = links.map((link, index) => {
      const { name, path } = link;
      const isSelected = selectedLink === name;

      return (
         <motion.div key={index} className='px-3 mb-2' variants={fadeInOutVariants} >
            <Link
               to={path}
               className='text-decoration-none'
               onClick={() => {
                  setSelectedLink(name);
                  setExpandMenu(false);
               }}
            >
               <div
                  className='navItem rounded px-3 py-1 d-flex justify-content-start align-items-center'
                  style={{
                     transition: 'all .2s ease-in-out',
                     borderWidth: '1px',
                     borderStyle: 'solid',
                     borderTopColor: 'transparent',
                     borderRightColor: isSelected ? 'var(--mainPalette7)' : 'transparent',
                     borderBottomColor: isSelected ? 'var(--mainPalette7)' : 'transparent',
                     borderLeftColor: 'transparent',
                     color: isSelected ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
                     backgroundColor: isSelected ? 'var(--mainPalette9)' : 'transparent',
                     opacity: isSelected ? '1' : '0.5',
                     fontWeight: isSelected ? '500' : '400'
                  }}
               >
                  <i className={`bi ${link.icon}`}></i>
                  <span className='ms-3'>{link.name}</span>
               </div>
            </Link>
         </motion.div>
      );
   });

   // button that logs out the user
   const logoutButtonJSX = (
      <motion.button
         className='border-0 bg-none text-danger text-end mt-auto'
         onClick={logout}
         type='button'
         variants={fadeInOutVariants}
      >
         <span className='me-3'>Logout</span>
         <i className='bi bi-box-arrow-right'></i>
      </motion.button>
   );

   return (
      <nav aria-label='Navigation Menu' className='navMenu'>

         {/* displayed on smaller screens */}
         <div className='smallMenu d-md-none position-relative'>
            <div
               className='d-flex position-relative justify-content-between align-items-center bg-white py-2'
               style={{
                  zIndex: '2'
               }}
            >

               {/* current page name */}
               <span className='fs-6 d-md-none ps-3'>{selectedLink}</span>

               {/* menu button */}
               <button
                  className='bg-none border-0 py-2 px-3'
                  onClick={() => setExpandMenu(!expandMenu)}
                  type='button'
               >
                  <i className={`bi bi-${expandMenu ? 'x-lg' : 'list'}`}></i>
               </button>
            </div>

            {/* container for the links and logout button*/}
            <AnimatePresence mode='wait' onExitComplete={() => setExpandMenu(false)}>
               {expandMenu &&
                  <motion.div
                     className='d-flex flex-column rounded-bottom position-absolute bg-white w-100 top-100 start-0 text-secondary'
                     variants={expandCollapseVariants}
                     initial='mount'
                     animate='animation'
                     exit='unmount'
                  >
                     {/* navigation links to other pages */}
                     {navLinksJSX}

                     {/* LOGOUT BUTTON */}
                     {logoutButtonJSX}
                  </motion.div>
               }
            </AnimatePresence>
         </div>


         {/* displayed on larger screens */}
         <div
            className='largeMenu d-none d-md-flex flex-column p-3 position-fixed top-0 start-0 overflow-auto h-100 bg-white'
            style={{
               borderRight: '1px solid var(--mainPalette6)',
               width: '200px'
            }}
         >
            <span
               className='text-center mb-2'
               style={{ fontWeight: '500' }}
            >
               Moving Forward for U
            </span>

            {/* LOGO */}
            <div
               className='rounded-circle d-flex justify-content-center align-items-center mx-auto mb-5 p-4'
               style={{
                  backgroundColor: 'var(--bs-gray-200)',
                  borderRight: '1px solid var(--bs-gray-400)',
                  borderBottom: '1px solid var(--bs-gray-400)',
                  height: '35px',
                  width: '35px'
               }}
            >
               <img
                  style={{ height: '25px', width: '25px' }}
                  src={logo} alt='SVG logo image'

               />
            </div>

            {navLinksJSX}

            {logoutButtonJSX}
         </div>

      </nav >
   );
};

export default NavMenu;