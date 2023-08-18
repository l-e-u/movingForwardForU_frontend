import { motion } from 'framer-motion';

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const TextInput = ({ input, onBlur, placeholder, prefixText, setInput, type }) => {
   const inputWrapperClasses = 'position-relative';

   const prefixClasses = 'position-absolute ps-2 top-50 start-0 translate-middle-y text-secondary';
   const prefixStyles = { opacity: '0.5' };

   const inputClasses = 'myTextInput w-100 rounded-1 text-reset';

   // if there's a prefixText, then for every 4 characters, apply 1.75rem
   const inputVariants = {
      mount: {
         border: '1px solid var(--bs-gray-400)',
         padding: prefixText ? `0.5rem 0.5rem 0.5rem ${Math.ceil(prefixText.length / 4) * 1.75}rem` : '0.5rem',
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   const handleOnInput = (e) => setInput(e.target.value);
   const handleOnBlur = (e) => {
      const value = removeExtraSpaces(e.target.value.trim());

      if (onBlur) return onBlur(value);
      setInput(value);
   };

   const inputJSX = <motion.input
      className={inputClasses}
      initial='mount'
      onBlur={handleOnBlur}
      onChange={handleOnInput}
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