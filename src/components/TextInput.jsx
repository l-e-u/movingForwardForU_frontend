import { motion } from 'framer-motion';

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const TextInput = ({ input, placeholder, prefixText, setInput, type }) => {
   const inputWrapperClasses = 'position-relative';

   const prefixClasses = 'position-absolute ps-2 top-50 start-0 translate-middle-y text-secondary';
   const prefixStyles = { opacity: '0.5' };

   const inputClasses = 'myTextInput w-100 rounded-1 text-reset';
   const inputVariants = {
      mount: {
         border: '1px solid var(--bs-gray-400)',
         padding: prefixText ? '0.5rem 0.5rem 0.5rem 2rem' : '0.5rem',
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   const inputJSX = <motion.input
      className={inputClasses}
      onBlur={e => setInput(removeExtraSpaces(e.target.value.trim()))}
      initial='mount'
      onChange={e => setInput(e.target.value)}
      placeholder={placeholder || ''}
      type={type || 'text'}
      value={input}
      variants={inputVariants}
      whileFocus='onFocus'
   />;

   // when there's a prefix, wrap the input element so that the prefix is positioned properly
   if (prefixText) {
      return (
         <div className={inputWrapperClasses}>
            <span className={prefixClasses} style={prefixStyles}>{prefixText}</span>
            {inputJSX}
         </div>
      );
   };

   return inputJSX;
};

export default TextInput;