import { motion } from 'framer-motion';

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const TextInput = ({ input, placeholder, setInput }) => {
   const inputClasses = 'myTextInput w-100 rounded-1 p-2';
   const inputVariants = {
      mount: {
         border: '1px solid var(--bs-gray-400)',
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
         initial='mount'
         onChange={e => setInput(e.target.value)}
         placeholder={placeholder || ''}
         type='text'
         value={input}
         variants={inputVariants}
         whileFocus='onFocus'
      />
   );
};

export default TextInput;