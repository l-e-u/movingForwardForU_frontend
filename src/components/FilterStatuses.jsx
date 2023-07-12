import { useEffect, useState } from 'react';

// components
import Select from 'react-select';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useStatusesContext } from '../hooks/useStatusesContext';


const FilterStatuses = ({ filter, setFilters }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { statuses, dispatch } = useStatusesContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const options = !statuses ? [] : statuses.map(status => ({ label: status.name, value: status._id }));

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/statuses`, { headers: { 'Authentication': `Bearer ${user.token}` } });

         // expecting all contacts
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setError(null);
            setIsLoading(false);

            dispatch({ type: 'SET_STATUSES', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   return (
      <Select
         className='text-reset'
         closeMenuOnSelect={false}
         isDisabled={error || isLoading}
         isLoading={isLoading}
         isMulti
         isSearchable
         isClearable
         placeholder='Select Status...'
         options={options}
         onChange={selected => {
            setFilters(prev => {
               const existingFilters = { ...prev };
               delete existingFilters.status;

               if (selected.length > 0) existingFilters.status = selected.map(sel => sel.value);

               return existingFilters;
            })
         }}
         value={filter.map(status => options.find(option => status === option.value))}
      />
   );
};

export default FilterStatuses;