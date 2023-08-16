import { useState } from 'react';

// hooks
import { useUpdateStatus } from '../hooks/useUpdateStatus';

// components
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
      <StatusForm
         {...editedStatus}
         error={error}
         heading={formHeading}
         hideForm={hideForm}
         handleSubmit={handleOnSubmit}
         setStatus={setEditedStatus}
         subHeading={formSubHeading}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
         isFetching={isLoading}
      />
   );
};

export default EditStatusForm;