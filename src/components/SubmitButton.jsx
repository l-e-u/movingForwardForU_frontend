import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// used in forms only, absolute positioned so the form has to be positioned something other than static
const SubmitButton = ({
   buttonText,
   isSubmittingForm,
   buttonType = 'button',
   isDisabled = false,
}) => {
   const [ellipsis, setEllipsis] = useState('');

   const canClick = !isSubmittingForm && !isDisabled;

   // styling
   const submitButtonClasses = 'submitButton border-top-0 border-start-0 rounded-pill px-5 py-1';
   const submitButtonStyles = {
      backgroundColor: canClick ? 'var(--mainPalette4)' : 'var(--bs-gray-100)',
      borderRight: canClick ? '2px solid var(--mainPalette2)' : '2px solid var(--bs-gray-400)',
      borderBottom: canClick ? '2px solid var(--mainPalette2)' : '2px solid var(--bs-gray-400)',
      color: canClick ? 'var(--bs-white)' : 'var(--bs-secondary)',
      cursor: isDisabled ? 'default' : 'pointer',
   };
   const submitButtonVariants = {
      mount: {
         scale: 1,
      },
      onHover: {
         scale: 1.1,
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
         disabled={isSubmittingForm || isDisabled}
         initial='mount'
         style={submitButtonStyles}
         type={buttonType}
         variants={submitButtonVariants}
         whileHover={canClick ? 'onHover' : 'none'}
      >
         <div className={textContainerClasses}>
            {buttonText}
            {isSubmittingForm && <span className={ellipsisClasses}>{ellipsis}</span>}
         </div>
      </motion.button>
   )
};

export default SubmitButton;