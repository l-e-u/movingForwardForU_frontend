// utilities
import { formatToCurrencyString, removeCommasFromString } from '../utils/StringUtils';

// takes the amount and formats it to a string representing a currency (0,000,000.00). when the input is empty, the value set is null, when the amount is null, the currncy string is empty
const CurrencyInput = ({ input, setInput }) => {
   const inputClasses = 'w-100 border-0';
   const inputStyles = { outline: 'none' };
   const inputVariants = {
      mount: {
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
      <input
         className={inputClasses}
         style={inputStyles}
         onBlur={handleOnBlur}
         onChange={handleOnChange}
         title='Needs to be a currency.'
         type='text'
         value={formatValue(input)}
      />
   );
};

export default CurrencyInput;