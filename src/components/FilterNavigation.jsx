import { motion } from 'framer-motion';

const buttonVariants = {
   mount: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderRight: '1px solid transparent',
      borderBottom: '1px solid transparent',
      borderRadius: '0px',
      color: 'var(--bs-secondary)',
      height: '40px',
      width: '40px'
   },
   onHover: {
      backgroundColor: 'rgba(255, 255, 255, .25)',
      borderRadius: '10px'
   }
}

const ArrowButton = ({ arrowDirection, isDisabled, onClick }) => (
   <motion.button
      className={`border-0 fs-smaller${isDisabled ? ' visibility-hidden' : ''}`}
      disabled={isDisabled}
      initial='mount'
      onClick={onClick}
      type='button'
      variants={buttonVariants}
      whileHover='onHover'
   >
      <i className={`bi bi-arrow-${arrowDirection}`}></i>
   </motion.button>
);

const LetterButton = ({ isCurrentPage, isDisabled, onClick, letter }) => (
   <motion.button
      animate={{
         backgroundColor: isCurrentPage ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
         borderRadius: isCurrentPage ? buttonVariants.onHover.borderRadius : buttonVariants.mount.borderRadius,
         borderRight: isCurrentPage ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         borderBottom: isCurrentPage ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         color: isCurrentPage ? 'var(--mainPalette2)' : 'var(--bs-secondary)'
      }}
      className='border-top-0 border-start-0 fs-smaller text-capitalize'
      disabled={isDisabled}
      initial='mount'
      onClick={onClick}
      type='button'
      variants={buttonVariants}
      whileHover='onHover'
   >
      {letter}
   </motion.button >
);

const FilterNavigation = ({
   currentLetter,
   isFetching,
   setLetterFilter,
}) => {
   const letterFilterButtonsJSX = [];
   const filterOptions = '#abcdefghijklmnopqrstuvwxyz';
   const currentIndex = filterOptions.indexOf(currentLetter);
   const hasPrevious = currentIndex > 0;
   const hasNext = (currentIndex >= 0) && (currentIndex < filterOptions.length - 1);

   // PREVIOUS LETTER BUTTON
   letterFilterButtonsJSX.push(
      <ArrowButton
         arrowDirection={'left'}
         isDisabled={!hasPrevious || isFetching}
         key={'prevLetter'}
         onClick={() => {
            if (hasPrevious) setLetterFilter(filterOptions[currentIndex - 1]);
         }}
      />
   );

   // ALPHABET BUTTONS
   for (let index = 0; index < filterOptions.length; index++) {
      const letter = filterOptions[index];

      letterFilterButtonsJSX.push(
         <LetterButton
            isCurrentPage={currentIndex === index}
            isDisabled={isFetching}
            key={letter}
            onClick={() => {
               setLetterFilter(index === 0 ? '[0-9]' : letter);
            }}
            letter={letter}
         />
      );
   };

   // NEXT LETTER BUTTON
   letterFilterButtonsJSX.push(
      <ArrowButton
         arrowDirection={'right'}
         isDisabled={!hasNext || isFetching}
         key={'nextLetter'}
         onClick={() => {
            if (hasNext) setLetterFilter(filterOptions[currentIndex + 1]);
         }}
      />
   );

   return (
      <nav aria-label='pagination' className='d-flex justify-content-between'>
         <div className='text-reset flex-grow-1'> {letterFilterButtonsJSX} </div>
      </nav>
   );
};

export default FilterNavigation;