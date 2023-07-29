import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useCreateStatus } from '../hooks/useCreateStatus';

// components
import Modal from './Modal';
import StatusForm from './StatusForm';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ hideForm, showForm }) => {
   const newStatus = { name: '', description: '' };
   const { clearError, createStatus, error, isLoading } = useCreateStatus();
   const [status, setStatus] = useState(newStatus);

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      let statusCreated = await createStatus(status);
      if (statusCreated) hideForm();
   };

   const resetForm = () => {
      setStatus(newStatus);
      clearError();
   };

   return (
      <AnimatePresence mode='wait' onExitComplete={resetForm}>
         {showForm &&
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
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  setStatus={setStatus}
               />
            </Modal>
         }
      </AnimatePresence>
   );
};

export default CreateStatusForm;