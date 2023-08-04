import { useState } from 'react';

// hooks
import { useUpdateFee } from '../hooks/useUpdateFee';

// components
import FeeForm from './FeeForm';
import Modal from './Modal';

const EditFeeForm = ({ currentFee, hideForm }) => {
   const { updateFee, error, isLoading } = useUpdateFee();

   // get the document id that's being edited
   const { _id } = currentFee;

   // make a copy of the current fee to compare updated fields when submitting
   const [editedFee, setEditededFee] = useState({
      amount: currentFee.amount.toString(),
      name: currentFee.name,
      description: currentFee.description
   });

   // defining form options
   const formHeading = 'Edit Fee';
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

      for (const property of Object.keys(editedFee)) {
         const currentValue = currentFee[property];
         const editedValue = editedFee[property];

         if (currentValue.toString().trim() !== editedValue.toString().trim()) {
            updatedFields[property] = editedValue;
         };
      };

      const feeWasUpdated = await updateFee({
         _id,
         fee: updatedFields
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

         <FeeForm
            {...editedFee}
            error={error}
            heading={formHeading}
            handleSubmit={handleOnSubmit}
            setFee={setEditededFee}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
            isFetching={isLoading}
         />
      </Modal>
   );
};

export default EditFeeForm;