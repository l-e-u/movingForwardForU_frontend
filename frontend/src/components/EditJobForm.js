import { useState } from 'react';
import { useUpdateJob } from '../hooks/useUpdateJob.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';
import { parseJSON } from 'date-fns';

const EditJobForm = ({ prevJob, setShowThisForm }) => {
    const { updateJob, error, isLoading, setError } = useUpdateJob();
    const [job, setJob] = useState(prevJob);
    const updatedProperties = {};

    // check if there has been any changes in the inputs, other than extra white space
    // if an input value has character changes, add it to the updatedProperties that will be used to update the document
    if (prevJob.status._id !== job.status?._id) updatedProperties.status = job.status?._id;
    if (prevJob.customer._id !== job.customer?._id) updatedProperties.customer = job.customer?._id;
    if (!noCharChanges(prevJob.reference ?? '', job.reference ?? '')) updatedProperties.reference = job.reference;
    if (!noCharChanges(prevJob.parcel ?? '', job.parcel ?? '')) updatedProperties.parcel = job.parcel;
    if (JSON.stringify(prevJob.pickup) !== JSON.stringify(job.pickup)) updatedProperties.pickup = job.pickup;
    if (JSON.stringify(prevJob.delivery) !== JSON.stringify(job.delivery)) updatedProperties.delivery = job.delivery;
    if ((prevJob.drivers.length !== job.drivers.length) || !prevJob.drivers.every(driver => job.drivers.some(d => driver._id === d._id))) updatedProperties.drivers = job.drivers;

    const differentNumberOfNotes = prevJob.logs?.length !== job.logs?.length;

    // when both previous job and current job have the same length, go through each one to see if they've changed
    const notesChange = !prevJob.logs.every((log, index) => {

        // different ids are a clear change, fail the check
        if (log._id !== job.logs[index]?._id) return false;

        // if it's the same note, check for changes in its content
        return noCharChanges(log.note ?? '', job.logs[index]?.note ?? '');
    }
    );

    // if theres different lengths of notes, or any note content has character changes, update the notes array
    if (differentNumberOfNotes || notesChange) updatedProperties.logs = job.logs;

    // any empty object means there has been no character changes on any inputs
    const noInputChanges = Object.keys(updatedProperties).length === 0;

    return (
        <div>
            <FormHeader text='Edit Job'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <JobForm
                job={job}
                setJob={setJob}
                setError={setError}
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await updateJob({
                        _id: prevJob._id,
                        job: { ...updatedProperties },
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </div>
    );
};

export default EditJobForm;