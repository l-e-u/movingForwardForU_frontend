import { useEffect } from 'react';

// components
import Select from 'react-select';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';


const FilterCustomers = ({ isDisabled, selectedCustomerFilters, setSelectedCustomerFilters }) => {
   const { contacts } = useContactsContext();
   const { getContacts, error, isLoading } = useGetContacts();

   const options = contacts.map(contact => ({ label: contact.organization, value: contact._id }));
   const handleOnChange = (selectedOptions) => setSelectedCustomerFilters(selectedOptions.map(option => option.value));
   const value = selectedCustomerFilters.map(status => options.find(option => status === option.value));

   // on first mount only, get all contacts
   useEffect(() => {
      getContacts();
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
   );
};

export default FilterCustomers;