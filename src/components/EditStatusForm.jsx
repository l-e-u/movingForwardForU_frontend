import { useState } from 'react';

// hooks
import { useUpdateStatus } from '../hooks/useUpdateStatus';

// components
import Modal from './Modal';
import StatusForm from './StatusForm';

// Form to update a status
const EditStatusForm = ({ currentStatus, hideForm }) => {
   const { updateStatus, error, isLoading } = useUpdateStatus();

   // get the document id that's being edited
   const { _id } = currentStatus;

   // make a copy of the current status to compare updated fields when submitting
   const [editedStatus, setEditedStatus] = useState({
      name: currentStatus.name,
      description: currentStatus.description
   });

   // defining form options
   const formHeading = 'Edit Status';
   const formSubHeading = `Changes will be reflected across all categories except archives.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Updating' : 'Update';

   // styling for the button that closes/cancels the form
   const closeButtonClasses = 'position-absolute border-0 bg-none top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { zIndex: '1' };

   // close button X icon
   const closeIconClasses = 'bi bi-x-lg';

   // before submitting, check all the fields and only send the fields that have been updated by the user
   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const updatedFields = {};

      for (const property of Object.keys(editedStatus)) {
         const currentValue = currentStatus[property];
         const editedValue = editedStatus[property];

         if (currentValue.toString().trim() !== editedValue.toString().trim()) {
            updatedFields[property] = editedValue;
         };
      };

      const feeWasUpdated = await updateStatus({
         _id,
         status: updatedFields
      });

      if (feeWasUpdated) hideForm();
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

         <StatusForm
            {...editedStatus}
            error={error}
            heading={formHeading}
            handleSubmit={handleOnSubmit}
            setStatus={setEditedStatus}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
            isFetching={isLoading}
         />
      </Modal>
   );
};

export default EditStatusForm;