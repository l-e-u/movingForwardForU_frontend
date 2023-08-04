import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useCreateStatus } from '../hooks/useCreateStatus';

// components
import Modal from './Modal';
import StatusForm from './StatusForm';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ hideForm }) => {
   const { createStatus, error, isLoading } = useCreateStatus();

   const [status, setStatus] = useState({ name: '', description: '' });

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

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
            {...status}
            error={error}
            handleSubmit={handleOnSubmit}
            heading={formHeading}
            isFetching={isLoading}
            setStatus={setStatus}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
         />
      </Modal>
   );
};

export default CreateStatusForm;