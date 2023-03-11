import { useState } from 'react';
import { useCreateJob } from '../hooks/useCreateJob.js';

// components
import JobForm from './JobForm.js';
import FormHeader from './FormHeader.js';
import CloseFormButton from './XButton.js';

const CreateJobForm = ({ setShowThisForm }) => {
    const { createJob, error, setError, isLoading } = useCreateJob();
    const [job, setJob] = useState({
        customer: null,
        delivery: { address: '', date: null, includeTime: false },
        drivers: [],
        fees: [],
        notes: [],
        parcel: '',
        pickup: { address: '', date: null, includeTime: false },
        reference: '',
        status: null,
    });

    return (
        <>
            <FormHeader text='New Job'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <JobForm
                job={job}
                setJob={setJob}
                setError={setError}
                error={error}
                isDisabled={isLoading}
                handleSubmit={async (e) => {
                    e.preventDefault();
                    // return console.log(job);
                    await createJob({
                        ...job,
                        customer: job.customer?._id,
                        drivers: job.drivers.map(d => d._id),
                        fees: job.fees.map(f => f._id),
                        status: job.status?._id,
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </>
    );
};

export default CreateJobForm;