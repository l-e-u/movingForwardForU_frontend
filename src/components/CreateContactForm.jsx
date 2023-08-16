import { useState } from 'react';

// hooks
import { useCreateContact } from '../hooks/useCreateContact';

// components
import ContactForm from './ContactForm';

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ hideForm }) => {
   const { createContact, error, isLoading } = useCreateContact();

   const [contact, setContact] = useState({
      address: '',
      billingAddress: '',
      defaultFees: [],
      email: '',
      note: '',
      name: '',
      organization: '',
      phoneExt: '',
      phoneNumber: '',
      website: '',
   });
   const formHeading = 'New Contact';
   const formSubHeading = `The address can be used for pickup or delivery when selecting this contact on a job.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const contactCreated = await createContact(contact);
      if (contactCreated) hideForm();
   };

   return (
      <ContactForm
         contact={contact}
         error={error}
         handleSubmit={handleOnSubmit}
         heading={formHeading}
         hideForm={hideForm}
         isFetching={isLoading}
         setContact={setContact}
         subHeading={formSubHeading}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
      />
   );
};

export default CreateContactForm;