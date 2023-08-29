import { useEffect } from 'react';

// components
import Select from 'react-select';

// hooks
import { useFeesContext } from '../hooks/useFeesContext';
import { useGetFees } from '../hooks/useGetFees';


export const FilterFees = ({ isDisabled, selectedFeeFilters, setSelectedFeeFilters }) => {
   const { fees } = useFeesContext();
   const { getFees, error, isLoading } = useGetFees();

   const options = fees.map(fee => ({ label: fee.name, value: fee._id }));
   const handleOnChange = (selectedOptions) => setSelectedFeeFilters(selectedOptions.map(option => option.value));
   const value = selectedFeeFilters.map(feeID => options.find(option => feeID === option.value));

   useEffect(() => {
      getFees();
   }, []);

   return (
      <Select
         className='text-reset'
         classNamePrefix='mySelectInput'
         closeMenuOnSelect={false}
         isDisabled={error || isLoading || isDisabled}
         isLoading={isLoading}
         isMulti={true}
         isSearchable={true}
         isClearable={true}
         options={options}
         onChange={handleOnChange}
         placeholder='Select or Search'
         value={value}
      />
   )
};

export default FilterFees;