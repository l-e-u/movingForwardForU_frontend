import { useEffect, useState } from 'react';

// components
import Select from 'react-select';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useUsersContext } from '../hooks/useUsersContext';


const FilterDrivers = ({ filter, setFilters }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { users, dispatch } = useUsersContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const options = !users ? [] : users.map(user => ({ label: `${user.firstName} ${user.lastName} (${user.email})`, value: user._id }));

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/users`, { headers: { 'Authentication': `Bearer ${user.token}` } });

         // expecting all users
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setError(null);
            setIsLoading(false);

            dispatch({ type: 'SET_USERS', payload: json });
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
         placeholder='Select Driver...'
         options={options}
         onChange={selected => {
            setFilters(prev => {
               const existingFilters = { ...prev };
               delete existingFilters.drivers;

               if (selected.length > 0) existingFilters.drivers = selected.map(sel => sel.value);

               return existingFilters;
            })
         }}
         value={filter.map(user => options.find(option => user === option.value))}
      />
   );
};

export default FilterDrivers;