import { useEffect, useState } from 'react';

// components
import Select from 'react-select';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useContactsContext } from '../hooks/useContactsContext';


const FilterCustomers = ({ filter, setFilters }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { contacts, dispatch } = useContactsContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const options = !contacts ? [] : contacts.map(contact => ({ label: contact.organization, value: contact._id }));

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/contacts`, { headers: { 'Authentication': `Bearer ${user.token}` } });

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

            dispatch({ type: 'SET_CONTACTS', payload: json });
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
         placeholder='Select Customer...'
         options={options}
         onChange={selected => {
            setFilters(prev => {
               const existingFilters = { ...prev };
               delete existingFilters.customer;

               if (selected.length > 0) existingFilters.customer = selected.map(sel => sel.value);

               return existingFilters;
            })
         }}
         value={filter.map(contact => options.find(option => contact === option.value))}
      />
   );
};

export default FilterCustomers;