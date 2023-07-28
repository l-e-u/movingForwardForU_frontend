import { useState } from 'react';
import Input from 'react-select';

// components
import ContactSelect from './ContactSelect';
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import FeeSelect from './FeeSelect';
import NotesInput from './NotesInput';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';
import SmallHeader from './SmallHeader';
import StatusSelect from './StatusSelect';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';
import UserSelect from './UserSelect';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';
import { useFeesContext } from '../hooks/useFeesContext';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled, isLoading }) => {
   const { status, customer, billing, mileage, reference, parcel, drivers, notes } = job;

   const [isResizingImages, setIsResizingImages] = useState(false);

   const maxUploadSize = 5 * 1024 * 1024; // 5MB

   // filter all notes with attachment's length larger than zero and return only those attachments
   const arrayOfAttachments = notes.filter(note => note.attachments.length > 0).map(note => note.attachments);
   // flatten into an array of all all attachments
   const allAttachments = [].concat(...arrayOfAttachments);
   // filter out only the new files
   const allNewFilesToUpload = allAttachments.filter(attachment => attachment.file);
   const totalSizeOfNewImagesToUpload = allNewFilesToUpload.reduce((total, { file }) => total + file.size, 0);
   const withinUploadSizeLimit = totalSizeOfNewImagesToUpload <= maxUploadSize;

   // classes and styles for the form itself and all other elements within
   const formClasses = 'newJob position-relative p-4 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '600px' };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles}>

         <FormHeader text='New Job' />
         <p className='text-secondary fs-smaller mb-4'>This information is required to add a new job. The second step is optional.</p>

         <div className='container-fluid p-0'>

            {/* STATUS SELECTIONS */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Status' isRequired={true} />
               </div>
               <div className='col-sm-10'>
                  <StatusSelect setStatus={status => setJob(prev => ({ ...prev, status }))} />
               </div>
            </div>

            {/* CONTACT/CUSTOMER SELECTION */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Customer' isRequired={true} />
               </div>
               <div className='col-sm-10'>
                  <ContactSelect setContact={contact => setJob(prev => ({ ...prev, customer: contact }))} />
               </div>
            </div>

            {/* REFERENCE INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Reference' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.reference} setInput={input => setJob(prev => ({ ...prev, reference: input }))} />
               </div>
            </div>

            {/* PARCEL INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Parcel' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.parcel} setInput={input => setJob(prev => ({ ...prev, parcel: input }))} />
               </div>
            </div>

            {/* DRIVER SELECTION */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Drivers' />
               </div>
               <div className='col-sm-10'>
                  <UserSelect setUser={drivers => setJob(prev => ({ ...prev, drivers }))}
                  />
               </div>
            </div>

            {/* MILEAGE INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Mileage' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.mileage} setInput={input => setJob(prev => ({ ...prev, mileage: isNaN(input) ? 0 : Number(input) }))} />
               </div>
            </div>

            {/* FEE SELECT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Fees' />
               </div>
               <div className='col-sm-10'>
                  <FeeSelect selectedFees={job.billing.map(bill => bill.fee)} setFee={fee => {
                     setJob(prev => ({
                        ...prev,
                        billing: [
                           ...prev.billing,
                           {
                              adjustedAmount: null,
                              fee
                           }
                        ]
                     }))
                  }} />
               </div>
            </div>

         </div>

         <div className='container-fluid'>
            <div className='row'>
               <div className='col-xl-4 col-md-6 p-0 py-0 ps-xl-2 pe-md-2'>
                  {/* PICKUP ADDRESS/TIME */}
                  <PickupOrDeliveryInput
                     isPickup={true}
                     error={error?.path === 'pickup.address' ? error : null}
                     job={job}
                     setJob={setJob}
                  />
               </div>
               <div className='col-xl-4 col-md-6 p-0 py-0 pe-0 ps-md-2 mt-2 mt-md-0'>
                  {/* DELIVERY ADDRESS/TIME */}
                  <PickupOrDeliveryInput
                     isPickup={false}
                     error={error?.path === 'delivery.address' ? error : null}
                     job={job}
                     setJob={setJob}
                  />
               </div>
            </div>
         </div>

         {/* notes */}
         <NotesInput
            error={error}
            isResizingImages={isResizingImages}
            notes={notes} setJob={setJob}
            setError={setError}
            setIsResizingImages={setIsResizingImages}
            withinUploadSizeLimit={withinUploadSizeLimit}
         />

         {error && <ErrorAlert message={error.message} />}

         <SubmitButton defaultText='Save' loadingText='Saving' isLoading={isLoading} isDisabled={isResizingImages} />
      </form>
   );
};

export default JobForm;