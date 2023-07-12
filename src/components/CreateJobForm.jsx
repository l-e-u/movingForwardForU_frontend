import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';

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

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
         <div className='shadow mb-4' style={{ zIndex: '2' }}>
            <FormHeader text='New Job' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
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
            </div>
         </div>
      </CSSTransition>
   );
};

export default CreateJobForm;