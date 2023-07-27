import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// used in forms only, absolute positioned so the form has to be positioned something other than static
const SubmitButton = ({ defaultText, isLoading, loadingText, isDisabled = false }) => {
   const [ellipsis, setEllipsis] = useState('');

   // styling
   const submitButtonClasses = 'submitButton border-0 rounded-pill position-absolute top-100 start-50 text-white px-5 py-3';
   const submitButtonStyles = { backgroundColor: 'var(--mainPalette4)' }
   const submitButtonVariants = {
      mount: {
         transform: 'translate(-50%,-50%) scale(1)'
      },
      onHover: {
         transform: 'translate(-50%,-50%) scale(1.1)',
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette4)',
      }
   };

   // holds the loading or default text and the ellipsis
   const textContainerClasses = 'position-relative';
   const ellipsisClasses = 'position-absolute top-0 start-100 ms-1';

   useEffect(() => {
      const id = setInterval(() => {
         setEllipsis(prev => prev + '.');

         if (ellipsis.length > 2) setEllipsis('');
      }, 250);

      return () => clearInterval(id);
   });

   return (
      <motion.button
         className={submitButtonClasses}
         disabled={isLoading || isDisabled}
         initial='mount'
         style={submitButtonStyles}
         type='submit'
         variants={submitButtonVariants}
         whileHover='onHover'
      >
         <div className={textContainerClasses}>
            {isLoading ? loadingText : defaultText}
            {isLoading && <span className={ellipsisClasses}>{ellipsis}</span>}
         </div>
      </motion.button>
   )
};

export default SubmitButton;