import { useState } from 'react';

// hooks
import { useCreateFee } from '../hooks/useCreateFee';

// components
import FeeForm from './FeeForm';
import Modal from './Modal';

// utilities
import { removeCommasFromString } from '../utils/StringUtils';

const CreateFeeForm = ({ hideForm }) => {
   const { createFee, error, isLoading } = useCreateFee();

   const [fee, setFee] = useState({ amount: '', description: '', name: '' });

   const formHeading = 'New Fee';
   const formSubHeading = `Fees make up the billing of a job.\n\nThis amount is the fee's default value. When adding a fee to a job, you have the option to adjust the amount for that job.`;

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const feeCreated = await createFee({
         ...fee,
         amount: removeCommasFromString(fee.amount)
      });

      if (feeCreated) hideForm();
   };

   return (
      <FeeForm
         {...fee}
         error={error}
         handleSubmit={handleOnSubmit}
         heading={formHeading}
         hideForm={hideForm}
         isFetching={isLoading}
         setFee={setFee}
         subHeading={formSubHeading}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
      />
   );
};

export default CreateFeeForm;