import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import Modal from './Modal';
import JobForm from './JobForm';

const CreateJobForm = ({ setShowThisForm, setFilters }) => {
   const { createJob, error, setError, isLoading } = useCreateJob();
   const [job, setJob] = useState({
      billing: [],
      customer: null,
      delivery: { address: '', date: new Date(), includeTime: false },
      drivers: [],
      mileage: 0,
      notes: [],
      parcel: '',
      pickup: { address: '', date: new Date(), includeTime: false },
      reference: '',
      status: null,
   });

   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   const closeIconClasses = 'bi bi-x-lg';

   return (
      <Modal blurBackdrop={true}>
         <button
            className={closeButtonClasses}
            onClick={() => setShowThisForm(false)}
            style={closeButtonStyles}
            type='button'
         >
            <i className={closeIconClasses}></i>
         </button>
         <JobForm
            job={job}
            setJob={setJob}
            setError={setError}
            error={error}
            isDisabled={isLoading}
            isLoading={isLoading}
            handleSubmit={async (e) => {
               e.preventDefault();

               await createJob({
                  ...job,
                  customer: job.customer?._id,
                  drivers: job.drivers.map(d => d._id),
                  mileage: Number(job.mileage),
                  billing: job.billing.map(bill => {
                     let adjustedAmount = bill.adjustedAmount
                     if (adjustedAmount !== null) adjustedAmount = Number(adjustedAmount);

                     return {
                        adjustedAmount,
                        fee: bill.fee._id,
                     }
                  }),
                  status: job.status?._id,
               })
                  .then(isCreated => {
                     if (isCreated) {
                        setShowThisForm(false);

                        // this is to trigger Jobs to fetch with filters after a new job was created, that way the new job is listed if it satisfies current filters
                        setFilters(prev => ({ ...prev }));
                     };
                  })
            }}
         />
      </Modal>
   );
};

export default CreateJobForm;