import { motion } from 'framer-motion';

// utilities
import { formatToCurrencyString, removeCommasFromString } from '../utils/StringUtils';

// formats the value to a string that represents a currency
// doesn't allow additional decimals points and number of decimals
// automatically formats value to have thousands-grouping as user types
// on blur, it formats the value to 1 decimal places
const CurrencyInput = ({ input, setInput }) => {
   const inputWrapperClasses = 'position-relative';

   const prefixClasses = 'position-absolute ps-2 top-50 start-0 translate-middle-y text-secondary';
   const prefixStyles = { opacity: '0.5' };

   const inputClasses = 'myCurrencyInput w-100 rounded-1 py-2 ps-4 pe-2';
   const inputVariants = {
      mount: {
         border: '1px solid var(--bs-gray-400)',
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   const handleOnBlur = (e) => {
      const value = removeCommasFromString(e.target.value);
      setInput(isNaN(value) ? '' : formatToCurrencyString({ amount: value, setTwoDecimalPlaces: true }));
   };

   const handleOnChange = (e) => {
      let value = removeCommasFromString(e.target.value).trim();

      if (value === '-') return setInput(value);
      if (value === '.') return setInput('0' + value);
      if (value === '-.') return setInput('-0.');

      setInput(isNaN(value) ? input : value);
   };

   const formatValue = (value) => isNaN(value) ? value : formatToCurrencyString({ amount: value });

   return (
      <div className={inputWrapperClasses}>
         <span className={prefixClasses} style={prefixStyles}>$</span>
         <motion.input
            className={inputClasses}
            initial='mount'
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            title='Needs to be a currency.'
            type='text'
            value={formatValue(input)}
            variants={inputVariants}
            whileFocus='onFocus'
         />
      </div>
   );
};

export default CurrencyInput;