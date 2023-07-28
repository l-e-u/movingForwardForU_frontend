import { motion } from 'framer-motion';

// Appears some time after order has been place, every time a page is switched via the browser arrows, the modal show is set to false
const Modal = ({ children, blurBackdrop = false }) => {
   const modalClasses = 'myModal position-fixed d-flex top-0 start-0 w-100 h-100 overflow-auto';
   const modalStyles = { zIndex: '1050' };

   const contentClasses = 'content position-relative m-auto';
   const contentStyles = { backgroundColor: 'transparent' };

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
      }
   };

   if (blurBackdrop) modalStyles.backdropFilter = 'blur(3px)';

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
            {children}
         </motion.div>
      </motion.div>
   )
};

export default Modal;