import { useState } from 'react';

// hooks
import { useCreateJob } from '../hooks/useCreateJob.js';

// components
import JobForm from './JobForm.js';
import FormHeader from './FormHeader.js';

const CreateJobForm = ({ setShowThisForm }) => {
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
        <div className='shadow mb-4'>
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
                                if (isCreated) setShowThisForm(false);
                            })
                    }} />
            </div>
        </div>
    );
};

export default CreateJobForm;