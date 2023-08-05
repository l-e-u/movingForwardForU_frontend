import { useState } from 'react';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import Modal from './Modal';
import JobForm from './JobForm';

const CreateJobForm = ({ hideForm }) => {
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
   console.log(hideForm)
   const { createJob, error, isLoading } = useCreateJob();

   // state for user inputs
   const [job, setJob] = useState(newJob);

   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'New Job';
   const formSubHeading = `As a dispatcher, you can see all jobs, but a driver will only see jobs that have been assigned to them.`;

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
            heading={formHeading}
            job={job}
            error={error}
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
            isFetching={isLoading}
            setJob={setJob}
            subHeading={formSubHeading}
            submitButtonIsDisabled={isLoading}
            submitButtonText={isLoading ? 'Saving' : 'Save'}
         />
      </Modal>
   );
};

export default CreateJobForm;