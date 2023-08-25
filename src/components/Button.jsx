import { motion } from 'framer-motion';

const Button = ({ children, handleClick }) => {
   const addButtonClasses = 'px-3 py-1 ms-auto position-relative border-start-0 border-top-0 rounded text-white d-flex justify-content-center align-items-center gap-1';
   const addButtonVariants = {
      mount: {
         backgroundColor: 'var(--mainPalette4)',
         borderRight: '1px solid var(--mainPalette2)',
         borderBottom: '1px solid var(--mainPalette2)'
      },
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
      }
   };

   return (
      <motion.button
         className={addButtonClasses}
         initial='mount'
         onClick={handleClick}
         type='button'
         variants={addButtonVariants}
         whileHover='onHover'
      >
         {children}
      </motion.button>
   );
};

export default Button;