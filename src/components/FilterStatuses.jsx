import { useEffect } from 'react';

// components
import Select from 'react-select';

// hooks
import { useStatusesContext } from '../hooks/useStatusesContext';
import { useGetStatuses } from '../hooks/useGetStatuses';

const FilterStatuses = ({ selectedStatusFilters, setSelectedStatusFilters }) => {
   const { statuses } = useStatusesContext();
   const { getStatuses, error, isLoading } = useGetStatuses();

   const options = statuses.map(status => ({ label: status.name, value: status._id }));
   const handleOnChange = (selectedOptions) => setSelectedStatusFilters(selectedOptions.map(option => option.value));
   const value = selectedStatusFilters.map(statusID => options.find(option => statusID === option.value));

   // on first mount only, get documents
   useEffect(() => {
      getStatuses();
   }, []);

   return (
      <Select
         className='text-reset'
         classNamePrefix='mySelectInput'
         closeMenuOnSelect={false}
         isDisabled={error || isLoading}
         isLoading={isLoading}
         isMulti={true}
         isSearchable={true}
         isClearable={true}
         options={options}
         onChange={handleOnChange}
         placeholder='Select or Search'
         value={value}
      />
   );
};

export default FilterStatuses;