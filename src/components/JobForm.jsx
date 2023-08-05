import { useState } from 'react';

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
import Tabs from './Tabs';
import TextInput from './TextInput';
import UserSelect from './UserSelect';

const JobForm = ({
   job,
   error,
   handleSubmit,
   heading,
   isFetching,
   subHeading,
   submitButtonIsDisabled,
   submitButtonText,
   setJob,
}) => {
   const {
      status,
      customer,
      billing,
      mileage,
      reference,
      parcel,
      drivers,
      notes
   } = job;

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

         <FormHeader text={heading} />
         <p className='text-secondary fs-smaller mb-4'>{subHeading}</p>

         <div className='container-fluid p-0'>

            {/* STATUS SELECTIONS */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Status' isRequired={true} />
               </div>
               <div className='col-sm-10 text-reset'>
                  <StatusSelect
                     placeholder='Required'
                     setStatus={status => setJob(prev => ({ ...prev, status }))}
                  />
               </div>
            </div>

            {/* CONTACT/CUSTOMER SELECTION */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Customer' isRequired={true} />
               </div>
               <div className='col-sm-10'>
                  <ContactSelect
                     placeholder='Required'
                     setContact={contact => setJob({ ...job, customer: contact })} />
               </div>
            </div>

            {/* REFERENCE INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Reference' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.reference} setInput={input => setJob(prev => ({ ...prev, reference: input }))} />
               </div>
            </div>

            {/* PARCEL INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Parcel' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.parcel} setInput={input => setJob(prev => ({ ...prev, parcel: input }))} />
               </div>
            </div>

            {/* DRIVER SELECTION */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Drivers' />
               </div>
               <div className='col-sm-10'>
                  <UserSelect setUser={drivers => setJob(prev => ({ ...prev, drivers }))}
                  />
               </div>
            </div>

            {/* MILEAGE INPUT */}
            <div className='row mb-3'>
               <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Mileage' />
               </div>
               <div className='col-sm-10'>
                  <TextInput input={job.mileage} setInput={input => setJob(prev => ({ ...prev, mileage: isNaN(input) ? 0 : Number(input) }))} />
               </div>
            </div>

         </div>

         {/* <Tabs tabs={[
            {
               name: 'Pickup',
               icon: 'bi bi-arrow-bar-up',
               contentJSX: (
                  <PickupOrDeliveryInput
                     isPickup={true}
                     error={error?.path === 'pickup.address' ? error : null}
                     job={job}
                     setJob={setJob}
                  />
               )
            },
            {
               name: 'Delivery',
               icon: 'bi bi-arrow-bar-down',
               contentJSX: (
                  <PickupOrDeliveryInput
                     isPickup={false}
                     error={error?.path === 'delivery.address' ? error : null}
                     job={job}
                     setJob={setJob}
                  />
               )
            }
         ]}
         /> */}

         <Tabs tabs={[
            {
               name: 'Notes',
               icon: 'bi bi-sticky',
               contentJSX: (
                  <div>notes here</div>
               )
            },
            {
               name: 'Billing',
               icon: 'bi bi-receipt-cutoff',
               contentJSX: (
                  <FeeSelect selectedFees={job.billing.map(bill => bill.fee)} setFee={fee => {
                     setJob({
                        ...job,
                        billing: [
                           ...job.billing,
                           {
                              adjustedAmount: null,
                              fee
                           }
                        ]
                     })
                  }} />
               )
            }
         ]} />

         {error && <ErrorAlert message={error.message} />}

         <SubmitButton
            buttonText={submitButtonText}
            isSubmittingForm={isFetching}
            isDisabled={submitButtonIsDisabled || isResizingImages}
         />
      </form>
   );
};

export default JobForm;