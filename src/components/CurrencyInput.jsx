import { useState } from 'react';

// utilities
import { formatCurrency, formatToCurrencyString, removeCommasFromString } from '../utils/StringUtils';

// takes the amount and formats it to a string representing a currency (0,000,000.00). when the input is empty, the value set is null, when the amount is null, the currncy string is empty
const CurrencyInput = ({ input, setInput }) => {
   const [currencyString, setCurrencyString] = useState(input);

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

   return (
      <input
         className={inputClasses}
         style={inputStyles}
         onBlur={e => {
            setCurrencyString(formatToCurrencyString({ amount: e.target.value, setTwoDecimalPlaces: true }));
         }}
         onChange={e => {

            // remove all the thousand-grouping commas
            const value = removeCommasFromString(e.target.value);
            console.log('value:', value);
            const forDisplay = formatToCurrencyString({ amount: value });

            console.log('to display:', forDisplay);

            setCurrencyString(forDisplay);

            console.log('to store:', isNaN(value) ? input : value);
            setInput(isNaN(value) ? input : value);
         }}
         title='Needs to be a currency.'
         type='text'
         value={currencyString}
      />
   );
};

export default CurrencyInput;