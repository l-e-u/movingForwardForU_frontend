import { useState } from 'react';

// hooks
import { useUpdateJob } from '../hooks/useUpdateJob';

// components
import JobForm from './JobForm';
import Modal from './Modal';

const EditJobForm = ({
   currentJob,
   hideForm,
}) => {
   const { updateJob, error, isLoading, setError } = useUpdateJob();

   const [editedJob, setEditedJob] = useState({
      ...currentJob,
      delivery: {
         ...currentJob.delivery,
         date: new Date(currentJob.delivery.date)
      },
      notes: currentJob.notes.map(note => ({ ...note })),
      pickup: {
         ...currentJob.pickup,
         date: new Date(currentJob.pickup.date)
      },
   });

   const { _id } = currentJob;

   // styling for the button that closes the form
   const closeButtonClasses = 'position-absolute border-0 top-0 end-0 fw-bold p-3 text-secondary';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   // close button X
   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'Edit Job';
   const formSubHeading = '';

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const updatedJobForm = new FormData();
      const updatedFields = {};
      const filesToDelete = [];

      // check if there has been any changes in the fields
      for (const [property, value] of Object.entries(currentJob)) {
         let hasBeenUpdated = false;
         let updatedValue;

         let currentValue;
         let editedValue;

         if (property === 'notes') {
            const sortByCreatedDateOldestFirst = (a, b) => ((new Date(a.createdAt)) - (new Date(b.createdAt)));

            // sort both current and edited notes from oldest to newest, only one new note can be added at a time, so a new note can always be found at the end of edited notes
            const currentSortedNotes = value.map(note => ({ ...note })).sort(sortByCreatedDateOldestFirst);
            const editedSortedNotes = editedJob.notes.map(note => ({ ...note })).sort(sortByCreatedDateOldestFirst);

            // start from the oldest notes, front of the array
            while (currentSortedNotes.length > 0) {
               currentValue = currentSortedNotes.shift();
               editedValue = editedSortedNotes[0];

               console.log(currentValue)
               console.log(editedValue)


               // if the current note has been deleted, then any attachments have to be deleted
               if (currentValue._id !== editedValue?._id) {
                  hasBeenUpdated = true;
                  currentValue.attachments.forEach(attachment => filesToDelete.push({ id: attachment._id }));

                  continue;
               };

               if (currentValue.message !== editedValue.message) {
                  hasBeenUpdated = true;
                  editedSortedNotes.shift();
                  continue;
               };

               editedSortedNotes.shift();
            };

            // after looping through the current notes, any new note is left behind and handled here
            if (editedSortedNotes.length > 0) {
               editedSortedNotes[0].attachments.forEach(attachment => updatedJobForm.append('attachments', attachment.file));
               hasBeenUpdated = true;
            };

            if (hasBeenUpdated) updatedValue = editedJob.notes.map(note => ({ ...note, createdBy: note.createdBy._id }));
         };

         // check if billing has any changes
         if (property === 'billing') {
            currentValue = JSON.stringify(value);
            editedValue = JSON.stringify(editedJob[property]);

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;
               updatedValue = editedJob.billing.map(bill => ({
                  fee: bill.fee._id,
                  overrideAmount: (bill.overrideAmount === null) ? null : Number(bill.overrideAmount)
               }));
            };
         };

         if (property === 'drivers') {
            currentValue = JSON.stringify(value.drivers);
            editedValue = JSON.stringify(editedJob.drivers);

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;

               updatedValue = editedJob.drivers.map(driver => driver._id);
            };
         };

         // check if any of the pickup or delivery details have changed
         if ((property === 'pickup') || (property === 'delivery')) {
            currentValue = JSON.stringify({ ...value, date: new Date(value.date).toUTCString() });
            editedValue = JSON.stringify({ ...editedJob[property], date: new Date(editedJob[property].date).toUTCString() });

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;
               updatedValue = editedJob[property];
            };
         };

         // check if the mileage, parcel, or reference have changed
         if ((property === 'mileage') || (property === 'parcel') || (property === 'reference')) {
            currentValue = value ?? '';
            editedValue = editedJob[property] ?? '';

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;
               updatedValue = editedValue
            };
         };

         // check if the _id of status or customer have changed
         if ((property === 'status') || (property === 'customer')) {
            currentValue = value._id;
            editedValue = editedJob[property]?._id ?? null;

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;
               updatedValue = editedValue
            };
         };

         // any flagged updates are stored
         if (hasBeenUpdated) updatedFields[property] = updatedValue;
      };

      updatedJobForm.append('filesToDelete', JSON.stringify(filesToDelete));
      updatedJobForm.append('updates', JSON.stringify(updatedFields));

      const jobUpdated = await updateJob({ _id, updatedJobForm });

      if (jobUpdated) hideForm();
   };

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
            job={editedJob}
            error={error}
            heading={formHeading}
            handleSubmit={handleOnSubmit}
            setJob={setEditedJob}
            subHeading={formSubHeading}
            submitButtonText={submitButtonText}
            submitButtonIsDisabled={isLoading}
            isFetching={isLoading}
         />
      </Modal>
   );
};

export default EditJobForm;