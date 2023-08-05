import { motion } from 'framer-motion';

// utilities
import { dateObjectToFormattedString__YYYY_MM_DD } from '../utils/StringUtils';

const DateInput = ({ input, setInput }) => {
   const valueString = input ? dateObjectToFormattedString__YYYY_MM_DD(input) : '';

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
         initial='mount'
         onChange={e => {
            const date = e.target.valueAsDate;

            // date input is based on UTC
            // this will bring the time to midnight on today's date in local timezone
            if (date) {
               date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            };

            setInput(date);
         }}
         type='date'
         value={valueString}
         variants={inputVariants}
         whileFocus='onFocus'
      />
   );
};

export default DateInput;