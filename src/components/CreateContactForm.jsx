import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useCreateContact } from '../hooks/useCreateContact';

// components
import ContactForm from './ContactForm';
import FormHeader from './FormHeader';

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ setShowThisForm }) => {
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
   });

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
         <div className='shadow'>
            <FormHeader text='New Contact' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
               <ContactForm
                  contact={contact}
                  setContact={setContact}
                  error={error}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  handleSubmit={async (e) => {
                     e.preventDefault();

                     await createContact(contact)
                        .then(isCreated => {
                           if (isCreated) setShowThisForm(false)
                        })
                  }} />
            </div>
         </div>
      </CSSTransition>
   );
};

export default CreateContactForm;