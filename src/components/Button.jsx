import { motion } from 'framer-motion';

const Button = ({ children, handleClick }) => {
   const addButtonClasses = 'px-3 py-1 border-start-0 border-top-0 rounded text-white d-flex align-items-center justify-content-center text-nowrap';
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