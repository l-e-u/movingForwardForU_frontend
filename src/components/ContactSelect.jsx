import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetContacts } from '../hooks/useGetContacts';
import { useContactsContext } from '../hooks/useContactsContext';

// components
import ErrorAlert from './ErrorAlert';

const ContactSelect = ({ setContact }) => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts } = useContactsContext();

   // label is what appears as an option in the dropdown list
   const selectOptions = contacts.map(contact => {
      return {
         label: contact.organization,
         value: contact._id
      }
   });

   // as the user selects from the dropdown options, setting saves the id, clearing will set to null
   const handleOnChange = (selectedOption) => {
      const selectedContact = contacts.find(contact => selectedOption?.value === contact._id);

      setContact(selectedContact || null);
   };

   // only on initial mount, fetch contacts
   useEffect(() => {
      getContacts();
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
         isSearchable
         isClearable
         loadingMessage={() => 'Loading customers...'}
         noOptionsMessage={() => 'No results.'}
         options={selectOptions}
         onChange={handleOnChange}
      />
   )
}

export default ContactSelect