import { useState } from 'react';
import { useUpdateContact } from '../hooks/useUpdateContact.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import CloseFormButton from './XButton.js';
import ContactForm from './ContactForm.js';
import FormHeader from './FormHeader.js';
import CautionNotice from './CautionNotice.js';

// Form to create a contact for a job and description of what the contact means.
const EditContactForm = ({ prevContact, setShowThisForm }) => {
    const { updateContact, error, isLoading } = useUpdateContact();
    const [contact, setContact] = useState(prevContact);
    const {
        organization,
        name,
        address,
        billingAddress,
        email,
        phoneNumber,
        phoneExt,
        misc
    } = contact;
    const {
        organization: prevOrganization,
        name: prevName,
        address: prevAddress,
        billingAddress: prevBillingAddress,
        email: prevEmail,
        phoneNumber: prevPhoneNumber,
        phoneExt: prevPhoneExt,
        misc: prevNote
    } = prevContact;

    // user cannot update a doc that has not character changes, this disables the update button
    const organizationHasChanged = !noCharChanges(prevOrganization ?? '', organization ?? '');
    const nameHasChanged = !noCharChanges(prevName ?? '', name ?? '');
    const addressHasChanged = !noCharChanges(prevAddress ?? '', address ?? '');
    const billingAddressHasChanged = !noCharChanges(prevBillingAddress ?? '', billingAddress ?? '');
    const emailHasChanged = !noCharChanges(prevEmail ?? '', email ?? '');
    const phoneNumberHasChanged = !noCharChanges(prevPhoneNumber ?? '', phoneNumber ?? '');
    const phoneExtHasChanged = !noCharChanges(prevPhoneExt ?? '', phoneExt ?? '');
    const miscHasChanged = !noCharChanges(prevNote ?? '', misc ?? '');
    const noInputChanges = !organizationHasChanged && !nameHasChanged && !addressHasChanged && !billingAddressHasChanged && !emailHasChanged && !phoneNumberHasChanged && !phoneExtHasChanged && !miscHasChanged;

    return (
        <div>
            <FormHeader text='Edit Contact'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <CautionNotice text='Changes will be reflected on jobs with this contact set as customer.' />

            <ContactForm
                contact={contact}
                setContact={setContact}
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    // when patching, only update the data that has been changed, any undefined values will be ignored in the backend
                    await updateContact({
                        _id: prevContact._id,
                        contact: {
                            organization: organizationHasChanged ? organization : undefined,
                            name: nameHasChanged ? name : undefined,
                            address: addressHasChanged ? address : undefined,
                            billingAddress: billingAddressHasChanged ? billingAddress : undefined,
                            email: emailHasChanged ? email : undefined,
                            phoneNumber: phoneNumberHasChanged ? phoneNumber : undefined,
                            phoneExt: phoneExtHasChanged ? phoneExt : undefined,
                            misc: miscHasChanged ? misc : undefined
                        }
                    })
                        .then(isUpdated => {
                            if (isUpdated) setShowThisForm(false);
                        });
                }} />
        </div>
    );
};

export default EditContactForm;