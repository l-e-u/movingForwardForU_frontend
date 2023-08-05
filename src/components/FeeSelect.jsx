import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetFees } from '../hooks/useGetFees';
import { useFeesContext } from '../hooks/useFeesContext';

// components
import ErrorAlert from './ErrorAlert';

const FeeSelect = ({ placeholder, selectedFees, setFee }) => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees } = useFeesContext();

   const selectedOptions = [];

   // only list fees that have not been selected to avoid duplicates
   for (let index = 0; index < fees.length; index++) {
      const { _id, name, amount } = fees[index];

      // label is what is listed on the options
      if (selectedFees.find(selectedFee => _id === selectedFee._id)) continue;
      selectedOptions.push({
         label: `${name}\n$${amount.toFixed(2)}`,
         value: _id
      })
   };

   // fee can selected multiple drivers, clearing returns an array
   const handleOnChange = (selectedOption) => setFee(fees.find(fee => selectedOption.value === fee._id));

   // only on initial mount, fetch fees
   useEffect(() => {
      getFees();
   }, []);

   if (error) {
      return <ErrorAlert message={error.message} />;
   };

   return (
      <Select
         classNamePrefix='mySelectInpu'
         hideSelectedOptions={true}
         isDisabled={isLoading}
         isLoading={isLoading}
         isClearable
         isSearchable
         loadingMessage={() => 'Loading...'}
         noOptionsMessage={() => 'No results.'}
         placeholder={placeholder || ''}
         options={selectedOptions}
         onChange={handleOnChange}
         styles={{
            option: (base) => ({
               ...base,
               whiteSpace: 'pre-wrap'
            })
         }}
         value={null}
      />
   )
};

export default FeeSelect;