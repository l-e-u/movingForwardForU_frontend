import { useState } from 'react';

// hooks
import { useCreateJob } from '../hooks/useCreateJob';

// components
import Modal from './Modal';
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
   console.log(job.pickup, job.delivery)
   const closeButtonClasses = 'position-absolute top-0 end-0 fw-bold p-3 text-secondary border-0';
   const closeButtonStyles = { background: 'transparent', zIndex: '1' };

   const closeIconClasses = 'bi bi-x-lg';

   const formHeading = 'New Job';
   const formSubHeading = `As a dispatcher, you can see all jobs, but a driver will only see jobs that have been assigned to them.`;

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
      console.log(formattedJob)
      const jobCreated = await createJob(jobForm);

      if (jobCreated) hideForm();
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
            heading={formHeading}
            job={job}
            error={error}
            handleSubmit={handleOnSubmit}
            isFetching={isLoading}
            setJob={setJob}
            subHeading={formSubHeading}
            submitButtonIsDisabled={isLoading}
            submitButtonText={submitButtonText}
         />
      </Modal>
   );
};

export default CreateJobForm;