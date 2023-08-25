import { useState, useEffect } from 'react';

// debounces value input
export const useDebounce = ({ value, seconds }) => {
   const [debounceValue, setDebounceValue] = useState(value);
   const milliSeconds = seconds * 1000;

   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebounceValue(value);
      }, milliSeconds);

      return () => {
         clearTimeout(timeout);
      };
   }, [value, seconds]);

   return debounceValue;
};