import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useUpdateJob } from '../hooks/useUpdateJob';

// functions
import { noCharChanges } from '../utils/StringUtils';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';

const EditJobForm = ({
   prevJob,
   setShowThisForm,
   callBack = () => { },
}) => {
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

   // notes cannot be rearranged, so comparing json string is used
   let notesHaveChanged = !noCharChanges(JSON.stringify(prevJob.notes), JSON.stringify(job.notes));

   // check to see if there's any deleted previous notes that had any attachments, if so, add them to an array to delete those attachments
   if (notesHaveChanged) {
      updatedProperties.notes = job.notes;

      // loop through each previous job note, if the previous id still exists in the updatedProperties note, check if the attachments have changed
      prevJob.notes.forEach(prevNote => {
         // skip this note if it didn't have any attachments
         if (!prevNote.attachments.length === 0) return;

         // find out if the previous note _id still exists and get it
         const note = updatedProperties.notes.find(note => note._id === prevNote._id);

         // if no result then the note was removed and its attachments are added to 'filesToDelete'
         // OR if the note was found and now it doesn't have attachments
         // OR the found note has attachments with new file(s)
         if (!note || !note.attachments[0] || note.attachments[0]?.file) {
            prevNote.attachments.forEach(attachment => filesToDelete.push({ id: attachment._id }));
         };
      });
   };

   // any empty object means there has been no character changes on any inputs
   const noInputChanges = Object.keys(updatedProperties).length === 0;

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
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

                     await updateJob({
                        filesToDelete,
                        _id: prevJob._id,
                        updates: { ...updatedProperties },
                     })
                        .then(isUpdated => {
                           if (isUpdated) {
                              setShowThisForm(false);
                              callBack();
                           };
                        })
                  }} />
            </div>
         </div>
      </CSSTransition>
   );
};

export default EditJobForm;