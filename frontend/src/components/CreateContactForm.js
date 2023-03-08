import { useState } from "react";
import { useCreateContact } from "../hooks/useCreateContact.js";

// components
import CloseFormButton from './XButton.js';
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
        <div>
            <FormHeader text='New Contact'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

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
    );
};

export default CreateContactForm;