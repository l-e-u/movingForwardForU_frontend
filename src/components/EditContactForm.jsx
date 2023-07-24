import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useUpdateContact } from '../hooks/useUpdateContact';

// functions
import { noCharChanges } from '../utils/StringUtils';

// components
import ContactForm from './ContactForm';
import FormHeader from './FormHeader';
import CautionNotice from './CautionNotice';

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
   const defaultFeesHasChanged = JSON.stringify(prevContact.defaultFees) !== JSON.stringify(contact.defaultFees);
   const noInputChanges = !organizationHasChanged && !nameHasChanged && !addressHasChanged && !billingAddressHasChanged && !emailHasChanged && !phoneNumberHasChanged && !phoneExtHasChanged && !miscHasChanged && !defaultFeesHasChanged;

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
         <div>
            <FormHeader text='Edit Contact' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
               <br />
               <CautionNotice text='Changes will be reflected on jobs with this contact set as a customer.' />

               <ContactForm
                  contact={contact}
                  setContact={setContact}
                  error={error}
                  isDisabled={isLoading || noInputChanges}
                  isLoading={isLoading}
                  handleSubmit={async (e) => {
                     e.preventDefault();

                     // when patching, only update the data that has been changed, any undefined values will be ignored in the backend
                     await updateContact({
                        _id: prevContact._id,
                        contact: {
                           address: addressHasChanged ? address : undefined,
                           billingAddress: billingAddressHasChanged ? billingAddress : undefined,
                           defaultFees: defaultFeesHasChanged ? contact.defaultFees.map(dFee => dFee._id) : undefined,
                           email: emailHasChanged ? email : undefined,
                           misc: miscHasChanged ? misc : undefined,
                           name: nameHasChanged ? name : undefined,
                           organization: organizationHasChanged ? organization : undefined,
                           phoneExt: phoneExtHasChanged ? phoneExt : undefined,
                           phoneNumber: phoneNumberHasChanged ? phoneNumber : undefined,
                        }
                     })
                        .then(isUpdated => {
                           if (isUpdated) setShowThisForm(false);
                        });
                  }} />
            </div>
         </div>
      </CSSTransition>
   );
};

export default EditContactForm;