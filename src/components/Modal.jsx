import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Appears some time after order has been place, every time a page is switched via the browser arrows, the modal show is set to false
const Modal = ({
   children,
   closeModal,
   blurBackdrop = false,
   canClose = false,
   maxWidth = '600px',
   topMarginIsFixed = false
}) => {
   const modalClasses = 'myModal position-fixed d-flex top-0 start-0 w-100 h-100 overflow-auto';
   const modalStyles = {
      background: 'linear-gradient(0deg, rgba(120,150,215,0.75) 0%, rgba(229,239,255,0.85) 29%, rgba(255,255,255,0) 100%)',
      zIndex: '1050'
   };

   // modals that change their height, will have a fixed height to prevent the modal being 
   const contentMarginClasses = topMarginIsFixed ? 'mt-3 mt-md-5 mx-auto mb-auto' : 'm-auto';
   const contentClasses = `content bg-white p-4 text-reset rounded-4 position-relative ${contentMarginClasses}`;
   const contentStyles = {
      maxWidth,
      backgroundColor: 'transparent',
      borderTop: '1px solid var(--bs-gray-400)',
      borderLeft: '1px solid var(--bs-gray-400)',
      borderRight: '5px solid var(--bs-gray-400)',
      borderBottom: '5px solid var(--bs-gray-400)',
      width: '90vw'
   };

   // small x when modal can be closed
   const closeButtonClasses = 'position-absolute top-0 end-0 pt-2 px-3 pb-3 text-danger border-0';
   const closeButtonStyles = { background: 'transparent', transform: 'rotate(45deg)', zIndex: '1' };

   const closeIconClasses = 'bi bi-plus';

   // backdrop will fade in before its children
   const backdropVariants = {
      hidden: {
         opacity: 0,
      },
      animation: {
         opacity: 1,
         transition: {
            duration: 0.5,
            when: 'beforeChildren'
         }
      },
      unmount: {
         opacity: 0,
         transition: {
            when: 'afterChildren',
            duration: 0.5
         }
      }
   };

   // content will slide from bottom to the top after the fade in
   const contentVariants = {
      hidden: {
         opacity: 0,
         top: '100%'
      },
      animation: {
         opacity: 1,
         top: '0%',
         transition: {
            ease: 'easeInOut',
            mass: 0.4,
            damping: 10,
            type: 'spring',
         }
      },
      unmount: {
         opacity: 0,
         top: '100%'
      }
   };

   if (blurBackdrop) {
      modalStyles.backdropFilter = 'blur(2px)';
      modalStyles.WebkitBackdropFilter = 'blur(2px)';
   };

   // on mount, prevent the body from scrolling
   useEffect(() => {
      document.body.classList.add('overflow-hidden');

      // on unmount, allow the body to scroll
      return () => document.body.classList.remove('overflow-hidden');
   }, []);

   return (
      <motion.div
         className={modalClasses}
         style={modalStyles}
         variants={backdropVariants}
         initial='hidden'
         animate='animation'
         exit='unmount'
      >
         <motion.div
            className={contentClasses}
            style={contentStyles}
            variants={contentVariants}
         >
            {
               canClose &&
               <button
                  className={closeButtonClasses}
                  onClick={closeModal}
                  style={closeButtonStyles}
                  type='button'
               >
                  <i className={closeIconClasses}></i>
               </button>
            }
            {children}
         </motion.div>
      </motion.div>
   )
};

export default Modal;