import { useState } from 'react';

// hooks
import { useCreateStatus } from '../hooks/useCreateStatus';

// components
import StatusForm from './StatusForm';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ hideForm }) => {
   const { createStatus, error, isLoading } = useCreateStatus();

   const [status, setStatus] = useState({ name: '', description: '' });

   const formHeading = 'New Status';
   const formSubHeading = `A status will categorize and describe the current state of a job.`

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const statusCreated = await createStatus(status);
      if (statusCreated) hideForm();
   };

   return (
      <StatusForm
         {...status}
         error={error}
         handleSubmit={handleOnSubmit}
         heading={formHeading}
         hideForm={hideForm}
         isFetching={isLoading}
         setStatus={setStatus}
         subHeading={formSubHeading}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
      />
   );
};

export default CreateStatusForm;