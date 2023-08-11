import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EllipsisMenu = ({ actions = [] }) => {
   const [showMenu, setShowMenu] = useState(false);
   const [userEnteredMenu, setUserEnteredMenu] = useState(false);

   const handleOnClickToggleMenu = () => setShowMenu(!showMenu);
   const userEnteredMenuTrue = () => setUserEnteredMenu(true);
   const hideMenu = () => setShowMenu(false);

   // delete and edit buttons are identical, expandContract button will have the same hover effects, but when its additional info is expanded, it will maintain its hover colors
   // const actionButtonVariants = {
   //    actionButton: {
   //       background: 'transparent',
   //       borderWidth: '1px',
   //       borderStyle: 'solid',
   //       borderColor: 'var(--bs-secondary)',
   //       color: 'var(--bs-secondary)',
   //       scale: 1,
   //       opacity: 0.5
   //    },
   //    expandContractButton: {
   //       background: 'transparent',
   //       borderWidth: '1px',
   //       borderStyle: 'solid',
   //       borderColor: expandAdditionalInfo ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
   //       color: expandAdditionalInfo ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
   //       scale: 1,
   //       opacity: expandAdditionalInfo ? 1 : 0.5
   //    },
   //    onHover: {
   //       borderColor: 'var(--mainPalette4)',
   //       color: 'var(--mainPalette4)',
   //       scale: 1.1,
   //       opacity: 1,
   //       transition: {
   //          duration: 0.2,
   //       }
   //    }
   // };

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
               delay: 0.5
            }
         }
      }
   };

   const actionOptionsJSX = actions.map((action, index) => (
      <button
         className='bg-none border-0 d-flex gap-2 text-reset'
         key={action.name.concat(index.toString().padStart(2, '0'))}
         onClick={action.handler}
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
                  className='ellipsisMenu border-end border-bottom rounded-1 fs-smaller position-absolute top-0 end-100 p-2 mt-2 shadow-sm'
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

   // return (
   //    <div className='position-absolute top-0 end-0 pt-1 pe-1'>
   //       {/* delete document button */}
   //       <motion.button className='rounded' onClick={() => { }} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
   //          <i className='bi bi-trash3'></i>
   //       </motion.button>

   //       {/* edit document button */}
   //       <motion.button className='rounded mx-4 mx-lg-5' onClick={showEditForm} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
   //          <i className='bi bi-pencil'></i>
   //       </motion.button>

   //       {/* user can expand and contract the additional info element */}
   //       <motion.button
   //          className='bg-none rounded'
   //          onClick={() => setExpandAdditionalInfo(!expandAdditionalInfo)}
   //          initial='expandContractButton'
   //          type='button'
   //          variants={actionButtonVariants}
   //          whileHover='onHover'
   //       >
   //          <i className={`bi bi-chevron-${expandAdditionalInfo ? 'contract' : 'expand'}`}></i>
   //       </motion.button>
   //    </div>
   // )
};

export default EllipsisMenu;