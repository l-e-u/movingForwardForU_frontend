import { useState } from 'react';

// components
import TextInput from './TextInput';

// accepts a date object and adjusts the time
const MilitaryTimeInput = ({ input, setInput }) => {

   return (
      <TextInput
         input
         setInput
      />
   )
};

export default MilitaryTimeInput;