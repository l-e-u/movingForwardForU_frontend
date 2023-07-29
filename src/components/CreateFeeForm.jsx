import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useCreateFee } from '../hooks/useCreateFee';

// components
import FeeForm from './FeeForm';
import Modal from './Modal';

const CreateFeeForm = ({ hideForm, showForm }) => {
   const newFee = { amount: '', description: '', name: '' };
   const { clearError, createFee, error, isLoading } = useCreateFee();
   const [fee, setFee] = useState(newFee);

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const feeCreated = await createFee(fee);
      if (feeCreated) hideForm();
   };

   const resetForm = () => {
      setFee(newFee);
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

               <FeeForm
                  {...fee}
                  error={error}
                  handleSubmit={handleOnSubmit}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  setFee={setFee}
               />
            </Modal>
         }
      </AnimatePresence>
   );
};

export default CreateFeeForm;