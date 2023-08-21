import { useState } from 'react';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import JobForm from './JobForm';

const CreateJobForm = ({ hideForm }) => {
   const { createJob, error, isLoading } = useCreateJob();

   const midnightDate = new Date();

   midnightDate.setMilliseconds(0);
   midnightDate.setSeconds(0);
   midnightDate.setMinutes(0);
   midnightDate.setHours(0);

   const locationDetails = { address: '', date: midnightDate, includeTime: false };

   // state for user inputs
   const [job, setJob] = useState({
      billing: [],
      customer: null,
      delivery: { ...locationDetails },
      drivers: [],
      mileage: 0,
      notes: [],
      parcel: '',
      pickup: { ...locationDetails },
      reference: '',
      status: null
   });
   const formHeading = 'New Job';

   const submitButtonText = isLoading ? 'Saving' : 'Save';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const formattedJob = {
         ...job,
         billing: job.billing.map(bill => ({
            fee: bill.fee._id,
            overrideAmount: (bill.overrideAmount === null) ? null : Number(bill.overrideAmount)
         })),
         customer: job.customer?._id,
         drivers: job.drivers.map(d => d._id),
         mileage: Number(job.mileage),
         notes: job.notes.map(note => ({ ...note, createdBy: note.createdBy._id })),
         status: job.status?._id
      }

      // create a multipart form data object to send to server
      const jobForm = new FormData();

      jobForm.append('job', JSON.stringify(formattedJob));

      formattedJob.notes[0]?.attachments.forEach(attachment => {
         jobForm.append('attachments', attachment.file);
      });

      const jobCreated = await createJob(jobForm);

      if (jobCreated) hideForm();
   };

   return (
      <JobForm
         heading={formHeading}
         job={job}
         error={error}
         handleSubmit={handleOnSubmit}
         hideForm={hideForm}
         isFetching={isLoading}
         setJob={setJob}
         submitButtonIsDisabled={isLoading}
         submitButtonText={submitButtonText}
      />
   );
};

export default CreateJobForm;