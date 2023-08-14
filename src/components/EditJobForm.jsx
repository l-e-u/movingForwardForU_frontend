import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useUpdateJob } from '../hooks/useUpdateJob';

// functions
import { noCharChanges } from '../utils/StringUtils';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';
import Modal from './Modal';

const EditJobForm = ({
   currentJob,
   hideForm,
   setShowThisForm,
   callBack = () => { },
}) => {
   const { updateJob, error, isLoading, setError } = useUpdateJob();
   const [job, setJob] = useState(currentJob);

   const [editedJob, setEditedJob] = useState({
      billing: currentJob.billing,
      customer: currentJob.customer,
      delivery: {
         ...currentJob.delivery,
         date: new Date(currentJob.delivery.date)
      },
      mileage: currentJob.mileage || '',
      notes: currentJob.notes,
      parcel: currentJob.parcel || '',
      pickup: {
         ...currentJob.pickup,
         date: new Date(currentJob.pickup.date)
      },
      reference: currentJob.reference || '',
      status: currentJob.status
   });

   const { _id } = currentJob;

   const updatedProperties = {};
   const filesToDelete = [];

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute border-0 top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'Edit Job';
   const formSubHeading = '';

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      console.log(editedJob);
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

         <JobForm
            job={editedJob}
            error={error}
            heading={formHeading}
            handleSubmit={handleOnSubmit}
            setJob={setEditedJob}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
            isFetching={isLoading}
         />
      </Modal>
   );
};

export default EditJobForm;