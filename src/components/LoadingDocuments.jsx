import { motion } from 'framer-motion';

const LoadingDocuments = () => {
   const containerClasses = 'd-flex';
   const containerStyles = { height: '300px' };

   const fadeVariants = {
      hidden: {
         opacity: 0
      },
      visible: {
         opacity: 1
      }
   };

   return (
      <motion.div
         animate='visible'
         className={containerClasses}
         exit='hidden'
         initial='hidden'
         style={containerStyles}
         variants={fadeVariants}
      >
         {/* for accessibility purposes, 'roles' property and nested span element are included */}
         <div className='spinner-border m-auto' role='status'>
            <span className='visually-hidden'>Loading...</span>
         </div>
      </motion.div>
   );
};

export default LoadingDocuments;