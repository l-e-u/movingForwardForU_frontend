import { useState } from 'react';
import { useUpdateJob } from '../hooks/useUpdateJob.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';

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

    const differentNumberOfNotes = prevJob.notes?.length !== job.notes?.length;

    // when both previous job and current job have the same length, go through each one to see if they've changed
    const notesChange = !prevJob.notes.every((note, index) => {

        // different ids means that a note was deleted
        if (note._id !== job.notes[index]?._id) return false;

        const { subject: prevSubject, message: prevMessage } = note;
        const { subject: currSubject, message: currMessage } = job.notes[index];

        // if it's the same note, check for changes in its content
        return noCharChanges(prevSubject ?? '', currSubject ?? '') && noCharChanges(prevMessage ?? '', currMessage ?? '');
    }
    );

    // if theres different lengths of notes, or any note content has character changes, update the notes array
    if (differentNumberOfNotes || notesChange) updatedProperties.notes = job.notes;

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