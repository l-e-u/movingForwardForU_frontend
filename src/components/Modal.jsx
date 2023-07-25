import { motion, AnimatePresence } from 'framer-motion';

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
      top: '100vw'
   },
   animation: {
      opacity: 1,
      top: '50%',
      transition: { ease: 'easeInOut' }
   }
}

// Appears some time after order has been place, every time a page is switched via the browser arrows, the modal show is set to false
const Modal = ({ children, blurBackdrop = false }) => {
   return (
      <AnimatePresence mode='wait'>
         <motion.div
            className='myModal position-fixed top-0 start-0 w-100 h-100'
            style={{
               backdropFilter: `${blurBackdrop ? '1px' : 'none'}`,
               zIndex: '50'
            }}
            variants={backdropVariants}
            initial='hidden'
            animate='animation'
            exit='hidden'
         >
            <motion.div
               className='content position-absolute start-50 translate-middle'
               variants={contentVariants}
            >
               {children}
            </motion.div>

         </motion.div>
      </AnimatePresence>
   )
};

export default Modal;