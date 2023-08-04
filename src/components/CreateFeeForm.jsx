import { useState } from 'react';

// hooks
import { useCreateFee } from '../hooks/useCreateFee';

// components
import FeeForm from './FeeForm';
import Modal from './Modal';

const CreateFeeForm = ({ hideForm }) => {
   const { createFee, error, isLoading } = useCreateFee();

   const [fee, setFee] = useState({ amount: '', description: '', name: '' });

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute border-0 top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'New Fee';
   const formSubHeading = `Fees make up the billing of a job.\n\nThis amount is the fee's default value. When adding a fee to a job, you have the option to adjust the amount for that job.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const feeCreated = await createFee(fee);
      if (feeCreated) hideForm();
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

         <FeeForm
            {...fee}
            error={error}
            handleSubmit={handleOnSubmit}
            heading={formHeading}
            isFetching={isLoading}
            setFee={setFee}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
         />
      </Modal>
   );
};

export default CreateFeeForm;