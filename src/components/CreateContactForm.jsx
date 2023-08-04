import { useState } from 'react';

// hooks
import { useCreateContact } from '../hooks/useCreateContact';

// components
import ContactForm from './ContactForm';
import FormHeader from './FormHeader';
import Modal from './Modal';

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ hideForm }) => {
   const { createContact, error, isLoading } = useCreateContact();

   const [contact, setContact] = useState({
      address: '',
      billingAddress: '',
      defaultFees: [],
      email: '',
      misc: '',
      name: '',
      organization: '',
      phoneExt: '',
      phoneNumber: '',
      website: '',
   });

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute border-0 top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'New Contact';
   const formSubHeading = `When selecting this contact on jobs, its information can complete fields automatically.\n\nThe address can be used for pickup or delivery, and the default fees list is added to a jobs billing.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const contactCreated = await createContact(contact);
      if (contactCreated) hideForm();
   };

   return (
      <Modal blurBackdrop={true}>
         <button
            className={closeButtonClasses}
            onClick={hideForm}
            style={closeButtonStyles}
            type='button'
         >
            <i className={closeIconClasses}></i>
         </button>

         <ContactForm
            contact={contact}
            error={error}
            handleSubmit={handleOnSubmit}
            heading={formHeading}
            isFetching={isLoading}
            setContact={setContact}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
         />
      </Modal>
   );
};

export default CreateContactForm;