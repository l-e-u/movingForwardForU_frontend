import { useState } from "react";

// hooks
import { useCreateContact } from "../hooks/useCreateContact.js";

// components
import ContactForm from './ContactForm.js';
import FormHeader from './FormHeader.js';

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ setShowThisForm }) => {
    const { createContact, error, isLoading } = useCreateContact();
    const [contact, setContact] = useState({
        organization: '',
        name: '',
        address: '',
        billingAddress: '',
        phoneNumber: '',
        phoneExt: '',
        misc: '',
        email: ''
    });

    return (
        <div className='shadow'>
            <FormHeader text='New Contact' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
                <ContactForm
                    contact={contact}
                    setContact={setContact}
                    error={error}
                    isDisabled={isLoading}
                    handleSubmit={async (e) => {
                        e.preventDefault();

                        await createContact(contact)
                            .then(isCreated => {
                                if (isCreated) setShowThisForm(false)
                            })
                    }} />
            </div>
        </div>
    );
};

export default CreateContactForm;