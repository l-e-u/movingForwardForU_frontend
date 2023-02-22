import { useState } from 'react';
import { useCreateJob } from '../hooks/useCreateJob.js';

// components
import JobForm from './JobForm.js';
import FormHeader from './FormHeader.js';
import CloseFormButton from './XButton.js';

const CreateJobForm = ({ setShowThisForm }) => {
    const { createJob, error, isLoading } = useCreateJob();
    const [job, setJob] = useState({
        pickup: { address: '' },
        delivery: { address: '' },
        drivers: [],
        parcel: '',
        reference: '',
        customer: null,
        status: null,
        logs: []
    });

    return (
        <div>
            <FormHeader text='New Job'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <JobForm
                job={job}
                setJob={setJob}
                error={error}
                isDisabled={isLoading}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await createJob({
                        ...job,
                        status: job.status?._id,
                        customer: job.customer?._id
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </div>
    );
};

export default CreateJobForm;