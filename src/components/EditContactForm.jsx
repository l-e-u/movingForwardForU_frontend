import { useState } from 'react';

// hooks
import { useUpdateContact } from '../hooks/useUpdateContact';

// components
import ContactForm from './ContactForm';
import Modal from './Modal';

// utilities
import { filterDigitsFromString } from '../utils/StringUtils';

// Form to create a contact for a job and description of what the contact means.
const EditContactForm = ({ currentContact, hideForm }) => {
   const { updateContact, error, isLoading } = useUpdateContact();

   // get the document id that's being edited
   const { _id } = currentContact;

   // make a copy of the current contact to compare updated fields when submitting
   // some optional fields may be null, default to empty string
   const [editedContact, setEditedContact] = useState({
      address: currentContact.address,
      billingAddress: currentContact.billingAddress || '',
      defaultFees: currentContact.defaultFees,
      email: currentContact.email || '',
      note: currentContact.note || '',
      name: currentContact.name || '',
      organization: currentContact.organization,
      phoneExt: currentContact.phoneExt || '',
      phoneNumber: currentContact.phoneNumber || '',
      website: currentContact.website || '',
   });

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute border-0 top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'New Contact';
   const formSubHeading = `The address can be used for pickup or delivery when selecting this contact on a job.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const updatedFields = {};
      let defaultFeesHaveChanged = false;

      // check if there has been any changes in the fields
      [
         'organization',
         'address',
         'billingAddress',
         'email',
         'name',
         'phoneExt',
         'phoneNumber',
         'website',
         'note'
      ].forEach(property => {
         let currentValue = currentContact[property] || '';
         let editedValue = editedContact[property];

         if (property === 'phoneNumber') {
            currentValue = filterDigitsFromString(currentValue);
            editedValue = filterDigitsFromString(editedValue);
         };

         if (currentValue !== editedValue) {
            updatedFields[property] = editedValue;
         };
      });

      // check for changes in selected default fees
      // having a different length is clear that was a change
      if (currentContact.defaultFees.length !== editedContact.defaultFees.length) {
         defaultFeesHaveChanged = true;
      }
      else {
         // since new fees are added at the end of the array, start at the end of the editedContact list
         for (let index = editedContact.length - 1; index > 0; index--) {
            const { _id } = editedContact.defaultFees[index];

            // check if it still exists in the currentContact list
            const found = currentContact.defaultFees.find(currentFee => _id === currentFee._id);

            // if this fails, then default fee list has been updated, and the loop is broken
            if (!found) {
               defaultFeesHaveChanged = true;
               break;
            };
         };
      };

      if (defaultFeesHaveChanged) updatedFields.defaultFees = editedContact.defaultFees;

      const contactUpdated = await updateContact({
         _id,
         updatedFields
      });
      if (contactUpdated) hideForm();
   };

   return (
      <Modal blurBackdrop={true} topMarginIsFixed={true}>
         <button
            className={closeButtonClasses}
            onClick={hideForm}
            style={closeButtonStyles}
            type='button'
         >
            <i className={closeIconClasses}></i>
         </button>

         <ContactForm
            contact={editedContact}
            error={error}
            heading={formHeading}
            handleSubmit={handleOnSubmit}
            setContact={setEditedContact}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
            isFetching={isLoading}
         />
      </Modal>
   );
};

export default EditContactForm;