import { motion } from 'framer-motion';

// Appears some time after order has been place, every time a page is switched via the browser arrows, the modal show is set to false
const Modal = ({ children, blurBackdrop = false }) => {
   const modalClasses = 'myModal background position-fixed d-flex top-0 start-0 w-100 h-100 overflow-auto';
   const modalStyles = {
      background: 'linear-gradient(0deg, rgba(193,228,255,1) 0%, rgba(229,239,255,1) 29%, rgba(255,255,255,0) 100%)',
      zIndex: '1050'
   };

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