import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import Modal from './Modal';
import JobForm from './JobForm';

const CreateJobForm = ({ hideForm, refreshJobList, showForm }) => {
   const newJob = {
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
   };

   const { createJob, error, setError, isLoading } = useCreateJob();
   const [job, setJob] = useState(newJob);

   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   const closeIconClasses = 'bi bi-x-lg';

   const clearInputs = () => setJob(newJob);

   return (
      <AnimatePresence mode='wait' onExitComplete={clearInputs}>
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
               <JobForm
                  job={job}
                  setJob={setJob}
                  setError={setError}
                  error={error}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  handleSubmit={async (e) => {
                     e.preventDefault();

                     const jobCreated = await createJob({
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
                     });

                     if (jobCreated) {
                        hideForm();
                        refreshJobList();
                     };
                  }}
               />
            </Modal>
         }
      </AnimatePresence>
   );
};

export default CreateJobForm;