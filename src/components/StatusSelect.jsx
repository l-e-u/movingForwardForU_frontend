import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import ErrorAlert from './ErrorAlert';

const StatusSelect = ({ setStatus }) => {
   const { getStatuses, error, isLoading } = useGetStatuses();
   const { statuses } = useStatusesContext();

   // label is what appears as an option in the dropdown list
   const selectOptions = statuses.map(status => {
      return {
         label: status.name,
         value: status._id
      }
   });

   // as the user selects from the dropdown options, setting saves the id, clearing will set to null
   const handleOnChange = (selectedOption) => {
      const selectedStatus = statuses.find(status => selectedOption?.value === status._id);

      setStatus(selectedStatus || null);
   };

   // only on initial mount, fetch statuses
   useEffect(() => {
      getStatuses();
   }, []);

   if (error) {
      return <ErrorAlert message={error.message} />;
   };

   return (
      <Select
         className='text-reset'
         closeMenuOnSelect={true}
         hideSelectedOptions={true}
         isDisabled={isLoading}
         isLoading={isLoading}
         isClearable
         isSearchable
         loadingMessage={() => 'Loading statuses...'}
         noOptionsMessage={() => 'No results.'}
         placeholder=''
         options={selectOptions}
         onChange={handleOnChange}
      />
   )
};

export default StatusSelect;