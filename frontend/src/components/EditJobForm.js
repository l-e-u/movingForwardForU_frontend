import { useState } from 'react';
import { useUpdateJob } from '../hooks/useUpdateJob.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';

const EditJobForm = ({ prevJob, setShowThisForm }) => {
    const { updateJob, error, isLoading, setError } = useUpdateJob();
    const [job, setJob] = useState(prevJob);
    const updatedProperties = {};
    const filesToDelete = [];

    // check if there has been any changes in the inputs, other than extra white space
    // if an input value has character changes, add it to the updatedProperties that will be used to update the document
    if (prevJob.status._id !== job.status?._id) updatedProperties.status = job.status?._id;
    if (prevJob.customer._id !== job.customer?._id) updatedProperties.customer = job.customer?._id;
    if (!noCharChanges(prevJob.reference ?? '', job.reference ?? '')) updatedProperties.reference = job.reference;
    if (!noCharChanges(prevJob.parcel ?? '', job.parcel ?? '')) updatedProperties.parcel = job.parcel;
    if (prevJob.mileage !== Number(job.mileage === '' ? 0 : job.mileage)) updatedProperties.mileage = Number(job.mileage);
    if (JSON.stringify(prevJob.pickup) !== JSON.stringify(job.pickup)) updatedProperties.pickup = job.pickup;
    if (JSON.stringify(prevJob.delivery) !== JSON.stringify(job.delivery)) updatedProperties.delivery = job.delivery;
    if ((prevJob.drivers.length !== job.drivers.length) || !prevJob.drivers.every(driver => job.drivers.some(d => driver._id === d._id))) updatedProperties.drivers = job.drivers;

    // check all the fees, if the lengths have changed, add them to 'updatedProperties', OR if any _id or adjustment amounts have changed, add to 'updatedProperties'
    if ((prevJob.billing.length !== job.billing.length) || !prevJob.billing.every(bill => job.billing.some(b => ((bill.fee._id === b.fee._id) && (String(bill.adjustedAmount) === String(b.adjustedAmount)))))) updatedProperties.billing = job.billing;

    let notesHaveChanged = false;

    // different lengths flag the boolean that notes have changed
    if (prevJob.notes.length !== job.notes.length) {
        notesHaveChanged = true;
    }
    else {
        // same lengths will go through each note and compare the subject, message, attachment, any changes flags the boolean that notes have changed
        notesHaveChanged = !prevJob.notes.every((prev, index) => {
            const note = job.notes[index];

            if (prev._id !== note._id) return false;
            if (!noCharChanges(prev.subject, note.subject)) return false;
            if (!noCharChanges(prev.message, note.message)) return false;
            if (prev.attachment?.filename !== note.attachment?.filename) return false;

            return true;
        });
    };

    // check to see if there's any deleted previous notes that had an attachement, if so, add them to an array
    if (notesHaveChanged) {
        updatedProperties.notes = job.notes;

        prevJob.notes.forEach(prevNote => {
            // skip this note if it didn't have an attachment
            if (!prevNote.attachment) return;

            // check to see if the previous note is still found in the newly changed notes
            if (!updatedProperties.notes.find(note => prevNote.attachment.files_id === note.attachment?.files_id)) filesToDelete.push({ id: prevNote.attachment.files_id })
        });
    };

    // any empty object means there has been no character changes on any inputs
    const noInputChanges = Object.keys(updatedProperties).length === 0;

    return (
        <div className='shadow'>
            <FormHeader text='Edit Job' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
                <JobForm
                    job={job}
                    setJob={setJob}
                    setError={setError}
                    error={error}
                    isDisabled={isLoading || noInputChanges}
                    isLoading={isLoading}
                    handleSubmit={async (e) => {
                        e.preventDefault();
                        // return console.log(updatedProperties, filesToDelete)
                        await updateJob({
                            filesToDelete,
                            _id: prevJob._id,
                            updates: { ...updatedProperties },
                        })
                            .then(isCreated => {
                                if (isCreated) setShowThisForm(false);
                            })
                    }} />
            </div>
        </div>
    );
};

export default EditJobForm;