import { motion } from 'framer-motion';

const ActionButton = ({
   alignX,
   alignY,
   text,
   handleOnClick = () => { },
   invertedColors = false,
   isDisabled = false,
   isLoading = false,
   type = 'button',
}) => {
   let alignClass;

   const buttonVariants = {
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: invertedColors ? '0px 0px 8px var(--mainPalette3)' : '0px 0px 8px var(--mainPalette9)',
      }
   }

   const buttonStyles = {
      backgroundColor: invertedColors ? 'var(--mainPalette3)' : 'var(--mainPalette9)',
      color: invertedColors ? 'white' : 'var(--mainPalette4)'
   };

   // sets the horizontal alignment
   switch (alignX) {
      case 'left':
         alignClass = ' me-auto';
         break;

      case 'center':
         alignClass = ' mx-auto';
         break;

      case 'right':
         alignClass = ' ms-auto';
         break;

      default:
         alignClass = '';
         break;
   }

   // sets vertical alignment
   switch (alignY) {
      case 'top':
         alignClass += ' mb-auto';
         break;

      case 'center':
         alignClass += ' my-auto';
         break;

      case 'bottom':
         alignClass += ' mt-auto';
         break;

      default:
         alignClass += '';
         break;
   }

   return (
      <motion.button
         className={`rounded-pill border-0 d-block actionButton px-4 py-1 ${alignClass}`}
         disabled={isDisabled}
         onClick={handleOnClick}
         style={buttonStyles}
         type={type}
         variants={buttonVariants}
         whileHover='onHover'
      >
         {isLoading && <span className='spinner-border spinner-border-sm me-1' role='status' aria-hidden='true'></span>}
         {text}
      </motion.button>
   );
};

export default ActionButton;