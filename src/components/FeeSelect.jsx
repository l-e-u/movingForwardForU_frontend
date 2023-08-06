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

   const feeSelectStyles = {
      option: (base) => ({
         ...base,
         whiteSpace: 'pre-wrap'
      }),
      multiValue: (base) => ({
         ...base,
         backgroundColor: 'var(--bs-gray-100)'
      }),
      multiValueLabel: (base) => ({
         ...base,
         color: 'var(--mainPalette1)',
      }),
      multiValueRemove: (base) => ({
         ...base,
         color: 'red'
      })
   };

   // create the fee options to be listed
   fees.forEach(fee => {
      const { amount, name } = fee;

      feeOptions.push({
         label: `${name}\n$${amount.toFixed(2)}`,
         value: fee
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
   )
};

export default FeeSelect;