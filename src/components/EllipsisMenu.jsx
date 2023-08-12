import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EllipsisMenu = ({ actions = [] }) => {
   const [showMenu, setShowMenu] = useState(false);
   const [userEnteredMenu, setUserEnteredMenu] = useState(false);

   const handleOnClickAction = (actionHandler) => {
      return () => {
         hideMenu();
         actionHandler();
      };
   };
   const handleOnClickToggleMenu = () => setShowMenu(!showMenu);
   const userEnteredMenuTrue = () => setUserEnteredMenu(true);
   const hideMenu = () => setShowMenu(false);

   const iconVariants = {
      mount: {
         opacity: 0.5
      },
      onHover: {
         opacity: 1
      }
   };

   const fadeVariants = {
      visible: {
         display: 'flex',
         opacity: 1
      },
      hidden: {
         display: 'none',
         opacity: 0,
         transition: {
            display: {
               delay: 1
            },
            opacity: {
               delay: 0.5
            }
         }
      }
   };

   const actionOptionsJSX = actions.map((action, index) => (
      <button
         className='bg-none border-0 d-flex gap-2 text-reset'
         key={action.name.concat(index.toString().padStart(2, '0'))}
         onClick={handleOnClickAction(action.handler)}
         style={{ outline: 'none' }}
         type='button'
      >
         <i className={action.icon}></i>
         <span>{action.name}</span>
      </button>
   ));

   useEffect(() => {
      // if the user never enters the menu, then hide it
      const timeoutID = setTimeout(() => {
         if (!userEnteredMenu) hideMenu();
      }, 5000);

      return () => clearTimeout(timeoutID);
   });

   return (
      <div className='position-absolute top-0 end-0 text-secondary'>
         <AnimatePresence mode='wait'>
            {
               showMenu &&
               <motion.div
                  className='ellipsisMenu d-flex flex-column gap-2 bg-white border-end border-bottom rounded-1 fs-smaller position-absolute top-0 end-100 p-2 mt-2 shadow-sm'
                  variants={fadeVariants}
                  initial='hidden'
                  animate='visible'
                  onMouseEnter={userEnteredMenuTrue}
                  onMouseLeave={hideMenu}
                  style={{ marginRight: '2rem' }}
                  exit='hidden'
               >
                  {
                     actionOptionsJSX
                  }
               </motion.div>
            }
         </AnimatePresence>

         <motion.i
            className='ellipsisIcon bi bi-three-dots-vertical position-absolute top-0 end-0 cursor-pointer p-2'
            initial='mount'
            onClick={handleOnClickToggleMenu}
            role='button'
            variants={iconVariants}
            whileHover='onHover'
         >
         </motion.i>
      </div>
   );
};

export default EllipsisMenu;