import { motion } from 'framer-motion';

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const TextInput = ({ input, setInput }) => {
   const inputClasses = 'w-100 rounded-1 p-2';
   const inputStyles = { border: '1px solid var(--bs-gray-400)' };
   const inputVariants = {
      mount: {
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   return (
      <motion.input
         className={inputClasses}
         onBlur={e => setInput(removeExtraSpaces(e.target.value.trim()))}
         onChange={e => setInput(e.target.value)}
         style={inputStyles}
         type='text'
         value={input}
         variants={inputVariants}
         initial='mount'
         whileFocus='onFocus'
      />
   );
};

export default TextInput;