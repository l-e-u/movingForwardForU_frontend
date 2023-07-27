import { motion, AnimatePresence } from 'framer-motion';

// Appears some time after order has been place, every time a page is switched via the browser arrows, the modal show is set to false
const Modal = ({ children, blurBackdrop = false }) => {
   const modalClasses = 'myModal position-fixed d-flex top-0 start-0 w-100 h-100 overflow-auto';
   const modalStyles = { zIndex: '1050' };

   const contentClasses = 'content position-relative m-auto';
   const contentStyles = { backgroundColor: 'transparent' };

   const backdropVariants = {
      hidden: { opacity: 0 },
      animation: {
         opacity: 1,
         transition: {
            duration: 0.5,
            when: 'beforeChildren'
         }
      }
   };

   const contentVariants = {
      hidden: {
         opacity: 0,
         top: '100%'
      },
      animation: {
         opacity: 1,
         top: '0%',
         transition: { ease: 'easeInOut' }
      }
   };

   if (blurBackdrop) modalStyles.backdropFilter = 'blur(3px)';

   return (
      <AnimatePresence mode='wait'>
         <motion.div
            className={modalClasses}
            style={modalStyles}
            variants={backdropVariants}
            initial='hidden'
            animate='animation'
            exit='hidden'
         >
            <motion.div
               className={contentClasses}
               style={contentStyles}
               variants={contentVariants}
            >
               {children}
            </motion.div>

         </motion.div>
      </AnimatePresence>
   )
};

export default Modal;