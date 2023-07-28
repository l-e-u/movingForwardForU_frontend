import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const GrowingTextArea = ({ input, setInput }) => {
   const textAreaRef = useRef(null);

   const textAreaClasses = 'w-100 rounded-1 p-2';
   const textAreaStyles = { border: '1px solid var(--bs-gray-400)', resize: 'none' };
   const textAreaVariants = {
      mount: {
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   useEffect(() => {
      if (textAreaRef) {
         // reset the height momentarily to get the correct scrollHeight for the textarea
         textAreaRef.current.style.height = '0px';

         const scrollHeight = textAreaRef.current.scrollHeight;

         // set the height directly, outside of the render loop
         // trying to set this with state or a ref will produce an incorrect value.
         textAreaRef.current.style.height = scrollHeight + 6 + 'px';
      };
   });

   return (
      <motion.textarea
         className={textAreaClasses}
         onChange={e => setInput(e.target.value)}
         onBlur={e => setInput(removeExtraSpaces(e.target.value.trim()))}
         style={textAreaStyles}
         ref={textAreaRef}
         rows={1}
         value={input}
         variants={textAreaVariants}
         initial='mount'
         whileFocus='onFocus'
      />
   );
};

export default GrowingTextArea;