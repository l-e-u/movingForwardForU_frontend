import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetContacts } from '../hooks/useGetContacts';
import { useContactsContext } from '../hooks/useContactsContext';

// components
import ErrorAlert from './ErrorAlert';

const ContactAddressSelect = ({ placeholder, setAddress, address }) => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts } = useContactsContext();

   // label is what appears as an option in the dropdown list
   const selectOptions = contacts.map(contact => ({
      label: contact.address,
      value: contact.address
   }));

   // as the user selects from the dropdown options, setting saves the id, clearing will set to null
   const handleOnChange = (selectedOption) => setAddress(selectedOption?.value || '');

   // only on initial mount, fetch contacts
   useEffect(() => { getContacts() }, []);

   if (error) return <ErrorAlert message={error.message} />;

   return (
      <Select
         classNamePrefix='mySelectInput'
         closeMenuOnSelect={true}
         hideSelectedOptions={true}
         isDisabled={isLoading}
         isLoading={isLoading}
         isSearchable
         isClearable
         loadingMessage={() => 'Loading...'}
         noOptionsMessage={() => 'No results.'}
         placeholder={placeholder || ''}
         options={selectOptions}
         onChange={handleOnChange}
         value={selectOptions.find(option => option.value === address)}
      />
   )
}

export default ContactAddressSelect