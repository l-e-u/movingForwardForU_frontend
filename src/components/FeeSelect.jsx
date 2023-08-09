import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetFees } from '../hooks/useGetFees';
import { useFeesContext } from '../hooks/useFeesContext';

// components
import ErrorAlert from './ErrorAlert';

const FeeSelect = ({ selectedFees, setFees }) => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees } = useFeesContext();

   const feeOptions = [];

   // return all the fees that match the options the user has selected
   const handleOnChange = (selectedOptions) => {
      setFees(
         fees.filter(fee => (
            selectedOptions.find(option => (
               fee._id === option.value._id
            ))
         ))
      );
   };

   // return all the options that match the fees the user has selected
   const getSelectedOptions = () => (
      feeOptions.filter(option => (
         selectedFees.find(fee => (
            option.value._id === fee._id
         ))
      ))
   );

   // styles for the select container and its children
   const feeSelectStyles = {
      container: (base) => ({
         ...base,
      }),
      input: (base) => ({
         ...base,
         minWidth: '100px'
      }),
      option: (base) => ({
         ...base,
      }),
      multiValue: (base) => ({
         ...base,
         backgroundColor: 'var(--bs-gray-100)',
         flexGrow: '1'
      }),
      multiValueLabel: (base) => ({
         ...base,
         color: 'var(--mainPalette1)',
         flexGrow: '1'
      }),
      multiValueRemove: (base) => ({
         ...base,
         color: 'red'
      })
   };

   // create the fee options to be listed
   fees.forEach(fee => {
      const { amount, name } = fee;

      // this key is applied to the label element when it's rendered, it's also the value that compared to user input when searching
      const key = name + amount.toString()

      feeOptions.push({
         index: name,
         label: (
            <div className='d-md-flex justify-content-between px-2'>
               <div>{name}</div>
               <div className='text-end'>$ {amount.toFixed(2)}</div>
            </div>
         ),
         value: {
            ...fee,
            toString: () => key
         }
      })
   });

   // only on initial mount, fetch fees
   useEffect(() => {
      getFees();
   }, []);

   if (error) {
      return <ErrorAlert message={error.message} />;
   };

   return (
      <Select
         classNamePrefix='mySelectInput'
         hideSelectedOptions={true}
         isClearable={false}
         isDisabled={isLoading}
         isLoading={isLoading}
         isMulti
         isSearchable
         loadingMessage={() => 'Loading...'}
         noOptionsMessage={() => 'No results.'}
         onChange={handleOnChange}
         options={feeOptions}
         placeholder=''
         styles={feeSelectStyles}
         value={getSelectedOptions()}
      />
   );
};

export default FeeSelect;