import Select from 'react-select';
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

const PageNumberButton = ({ isCurrentPage, isDisabled, onClick, pageNumber }) => (
   <motion.button
      animate={{
         backgroundColor: isCurrentPage ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
         borderRadius: isCurrentPage ? buttonVariants.onHover.borderRadius : buttonVariants.mount.borderRadius,
         borderRight: isCurrentPage ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         borderBottom: isCurrentPage ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         color: isCurrentPage ? 'var(--mainPalette2)' : 'var(--bs-secondary)'
      }}
      className='border-top-0 border-start-0 fs-smaller'
      disabled={isDisabled}
      initial='mount'
      onClick={onClick}
      type='button'
      variants={buttonVariants}
      whileHover='onHover'
   >
      {pageNumber}
   </motion.button >
);

const NavPagination = ({
   currentPage,
   limit,
   isFetching,
   onChangeLimit,
   setCurrentPageToNextPage,
   setCurrentPageToPreviousPage,
   setPages,
   totalPages,
}) => {
   const hasPrevious = ((currentPage > 1) && (currentPage <= totalPages));
   const hasNext = currentPage < totalPages ? true : false;
   const limits = [10, 25, 50, 100, 0];
   const pageNumbersJSX = [];

   const limitOptions = limits.map(num => ({
      label: num === 0 ? 'All' : num,
      value: num
   }));

   pageNumbersJSX.push(
      <ArrowButton
         arrowDirection={'left'}
         isDisabled={!hasPrevious || isFetching}
         key={'prevPage'}
         onClick={() => {
            if (hasPrevious) setCurrentPageToPreviousPage();
         }}
      />
   );

   // create the page number buttons between the previous and next buttons
   for (let index = 0; index < totalPages; index++) {
      const pageNumber = index + 1;
      const isCurrentPage = pageNumber === currentPage;

      pageNumbersJSX.push(
         <PageNumberButton
            isCurrentPage={isCurrentPage}
            isDisabled={isFetching}
            key={pageNumber}
            onClick={() => {
               if (!isCurrentPage) setPages({ current: pageNumber });
            }}
            pageNumber={pageNumber}
         />
      );
   };

   pageNumbersJSX.push(
      <ArrowButton
         arrowDirection={'right'}
         isDisabled={!hasNext || isFetching}
         key={'nextPage'}
         onClick={() => {
            if (hasNext) setCurrentPageToNextPage();
         }}
      />
   );

   return (
      <nav aria-label='pagination' className='d-flex justify-content-between'>
         <div className='text-reset flex-grow-1'> {pageNumbersJSX} </div>

         <Select
            classNamePrefix='mySelect'
            className='fs-smaller text-secondary ms-auto mb-auto'
            closeMenuOnSelect={true}
            isMulti={false}
            isSearchable={false}
            isClearable={false}
            onChange={selectedLimit => onChangeLimit(selectedLimit.value)}
            options={limitOptions}
            styles={{
               control: base => ({
                  ...base,
                  backgroundColor: 'transparent',
                  border: 0,
                  width: '75px'
               }),
               singleValue: base => ({
                  ...base,
                  color: 'var(--bs-secondary)'
               }),
               indicatorSeparator: base => ({
                  ...base,
                  display: 'none'
               })
            }}
            value={limitOptions.find(option => option.value === limit)}
         />
      </nav>
   );
};

export default NavPagination;