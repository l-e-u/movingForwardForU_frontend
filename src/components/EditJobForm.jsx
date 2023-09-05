import { useState } from 'react';

// hooks
import { useUpdateJob } from '../hooks/useUpdateJob';

// components
import JobForm from './JobForm';

const EditJobForm = ({
   currentJob,
   hideForm,
}) => {
   const { updateJob, error, isLoading } = useUpdateJob();

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

   const formHeading = 'Edit Job';

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const updates = {};
      const filesToDelete = [];

      // oldest to newest
      const sortDateAscending = ((a, b) => {
         const createdDate1 = new Date(a.createdAt);
         const createdDate2 = new Date(b.createdAt);

         if (createdDate1 < createdDate2) return 1;
         if (createdDate1 > createdDate2) return -1;

         return 0;
      });

      // check if there has been any changes in the fields
      for (const [property, value] of Object.entries(currentJob)) {
         let hasBeenUpdated = false;
         let updatedValue;

         let currentValue;
         let editedValue;

         if (property === 'notes') {
            // sort both current and edited notes from oldest to newest, only one new note can be added at a time, so a new note can always be found at the end of edited notes
            const currentSortedNotes = value.map(note => ({ ...note })).sort(sortDateAscending);
            const editedSortedNotes = editedJob.notes.map(note => ({ ...note })).sort(sortDateAscending);

            // start from the oldest notes, front of the array
            while (currentSortedNotes.length > 0) {
               currentValue = currentSortedNotes.shift();
               editedValue = editedSortedNotes[0];

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

            // after looping through the current notes, if there's one left behind, then that one is new
            if (editedSortedNotes.length > 0) hasBeenUpdated = true;

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
            currentValue = JSON.stringify(value);
            editedValue = JSON.stringify(editedJob.drivers);

            if (currentValue !== editedValue) {
               hasBeenUpdated = true;
               console.log(value)
               console.log(editedJob)
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
         if (hasBeenUpdated) updates[property] = updatedValue;
      };

      const jobUpdated = await updateJob({ _id, filesToDelete, updates });

      if (jobUpdated) hideForm();
   };

   return (
      <JobForm
         job={editedJob}
         error={error}
         heading={formHeading}
         handleSubmit={handleOnSubmit}
         hideForm={hideForm}
         setJob={setEditedJob}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
         isFetching={isLoading}
      />
   );
};

export default EditJobForm;