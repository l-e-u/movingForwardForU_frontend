import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// components
import BillingSelect from './BillingSelect';
import ContactSelect from './ContactSelect';
import ContactAddressSelect from './ContactAddressSelect';
import DateInput from './DateInput';
import ErrorAlert from './ErrorAlert';
import FileInput from './FileInput';
import FormHeader from './FormHeader';
import GoogleAddressSelect from './GoogleAddressSelect';
import GrowingTextArea from './GrowingTextArea';
import MilitaryTimeSelect from './MilitaryTimeSelect';
import SmallHeader from './SmallHeader';
import StatusSelect from './StatusSelect';
import SubmitButton from './SubmitButton';
import Tabs from './Tabs';
import TextInput from './TextInput';
import UserSelect from './UserSelect';
import SectionContainer from './SectionContainer';
import NoteInput from './NoteInput';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

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
   const { user } = useAuthContext();
   const {
      billing,
      customer,
      delivery,
      drivers,
      mileage,
      notes,
      parcel,
      pickup,
      reference,
      status,
   } = job;

   const [addressRadio, setAddressRadio] = useState('pickup');
   const [searchRadio, setSearchRadio] = useState('contacts');
   const [addressInput, setAddressInput] = useState('');
   const [showAppendNoteButton, setShowAppendNoteButton] = useState(true);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'px-3 py-1 ms-auto position-relative border-start-0 border-top-0 rounded text-white d-flex justify-content-center align-items-center gap-1';
   const addButtonVariants = {
      mount: {
         backgroundColor: 'var(--mainPalette4)',
         borderRight: '1px solid var(--mainPalette2)',
         borderBottom: '1px solid var(--mainPalette2)',
         opacity: 1
      },
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette4)',
      },
      unmount: {
         opacity: 0.5
      }
   };

   // helps determine when to show the address search options
   const address = job[addressRadio].address;
   const showContactAddressSearch = !address && (searchRadio === 'contacts');
   const showGoogleAddressSearch = !address && (searchRadio === 'google');
   const showCustomAddressInput = !address && (searchRadio === 'custom');

   const [isResizingImages, setIsResizingImages] = useState(false);

   const maxUploadSize = 5 * 1024 * 1024; // 5MB

   // filter all notes with attachment's length larger than zero and return only those attachments
   // const arrayOfAttachments = notes.filter(note => note.attachments.length > 0).map(note => note.attachments);
   // flatten into an array of all all attachments
   // const allAttachments = [].concat(...arrayOfAttachments);
   // filter out only the new files
   // const allNewFilesToUpload = allAttachments.filter(attachment => attachment.file);
   // const totalSizeOfNewImagesToUpload = allNewFilesToUpload.reduce((total, { file }) => total + file.size, 0);
   // const withinUploadSizeLimit = totalSizeOfNewImagesToUpload <= maxUploadSize;

   // classes and styles for the form itself and all other elements within
   const formClasses = 'newJob position-relative px-4 pt-4 pb-5 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '600px' };

   const fadeOutVariants = {
      visible: {
         opacity: 1,
         top: '0px',
         transition: {
            delay: 0.5
         }
      },
      hidden: {
         opacity: 0,
         top: '-100px',
      }
   };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles}>

         <FormHeader text={heading} />
         <p className='text-secondary fs-smaller mb-3'>{subHeading}</p>

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
                     propertyForOptionLabel='organization'
                     placeholder='Required'
                     setContact={contact => setJob({ ...job, customer: contact })}
                  />
               </div>
            </div>


            <SectionContainer>
               {/* RADIO BUTTONS: PICKUP AND DELIVERY SELECTIONS */}
               <div className='d-flex justify-content-between justify-content-sm-around mb-2'>

                  <div className='d-flex align-items-center gap-2'>
                     <input
                        checked={addressRadio === 'pickup'}
                        className='form-check-input fs-smaller cursor-pointer m-0'
                        id='addressRadioPickup'
                        onChange={() => {
                           setAddressRadio('pickup');
                           setSearchRadio('contacts');
                        }}
                        type='radio'
                     />
                     <label className='form-check-label text-secondary cursor-pointer' htmlFor='addressRadioPickup'>
                        <SmallHeader text='Pickup' />
                     </label>
                  </div>

                  <div className='d-flex align-items-center gap-2'>
                     <input
                        checked={addressRadio === 'delivery'}
                        className='form-check-input fs-smaller cursor-pointer m-0'
                        id='addressRadioDelivery'
                        onChange={() => {
                           setAddressRadio('delivery');
                           setSearchRadio('contacts');
                        }}
                        type='radio'
                     />
                     <label className='form-check-label text-secondary cursor-pointer' htmlFor='addressRadioDelivery'>
                        <SmallHeader text='Delivery' />
                     </label>
                  </div>

               </div>


               {/* PICKUP AND DELIVERY */}
               <div className='row mb-2'>
                  <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                     <SmallHeader text='Date' />
                  </div>
                  <div className='col-sm-10'>
                     <DateInput
                        input={job[addressRadio].date}
                        setInput={input => {
                           let includeTime = job[addressRadio].includeTime;
                           let date;

                           // when date is cleared, reset to today's date instead
                           if (!input) {
                              // create a new date and reset the time to midnight
                              date = new Date();
                              includeTime = false;
                           }
                           else {
                              date = input;
                              // date input is in UTC, adjust the time to set at midnight with correct day
                              date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

                              // when changing the date and includes a time, preserve the hours and minutes
                              if (includeTime) {
                                 date.setMinutes(job[addressRadio].date.getMinutes());
                                 date.setHours(job[addressRadio].date.getHours());
                              };
                           };

                           setJob({
                              ...job,
                              [addressRadio]: {
                                 ...job[addressRadio],
                                 date,
                                 includeTime
                              }
                           })
                        }}
                     />
                  </div>
               </div>

               {/* TIME */}
               <div className='row'>
                  <div className='col-sm-2 fs-smaller d-sm-flex'>

                     {/* TIME TOGGLE */}
                     <div className='form-check form-switch d-flex align-items-center justify-content-sm-end gap-2 p-0 m-0 mt-sm-auto ms-sm-auto mb-sm-2'>
                        <input
                           className='form-check-input my-auto mx-0'
                           checked={job[addressRadio].includeTime}
                           id='timeToggle'
                           onChange={(e) => {
                              const includeTime = e.target.checked;
                              const date = new Date(job[addressRadio].date);

                              // secs and ms are always zero'd out
                              date.setMilliseconds(0);
                              date.setSeconds(0);

                              // if a time is not going to be used, reset the time to zeros
                              if (!includeTime) {
                                 date.setMinutes(0);
                                 date.setHours(0);
                              };

                              setJob({
                                 ...job,
                                 [addressRadio]: {
                                    ...job[addressRadio],
                                    date,
                                    includeTime,
                                 }
                              })
                           }}
                           role='switch'
                           type='checkbox'
                        />
                        <label className='form-check-label text-secondary' htmlFor='timeToggle'>Time</label>
                     </div>
                  </div>

                  {/* MILITARY TIME SELECT */}
                  <div className='col-sm-10'>
                     <MilitaryTimeSelect
                        date={job[addressRadio].date}
                        isDisabled={!job[addressRadio].includeTime}
                        setTime={date => {
                           setJob({
                              ...job,
                              [addressRadio]: {
                                 ...job[addressRadio],
                                 date
                              }
                           })
                        }}
                     />
                  </div>
               </div>
            </SectionContainer>

            <br />

            <SectionContainer>
               {/* ONCE AN ADDRESS IS SET, THIS CAN BE CLEARED OUT TO SEARCH AGAIN */}
               <AnimatePresence mode='wait'>
                  {
                     address &&
                     <motion.div className='addressValue row' variants={fadeOutVariants} initial='hidden' animate='visible' exit='hidden'>
                        <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                           <SmallHeader text='Address' />
                        </div>
                        <div className='col-sm-10'>
                           <div className='d-flex bg-white align-items-center rounded-1 border ps-2'>
                              <span>
                                 {address}
                              </span>
                              <motion.i
                                 className='bi bi-x-lg p-2 ms-auto'
                                 initial={{ opacity: 0.5 }}
                                 onClick={() => {
                                    setAddressInput('');
                                    setSearchRadio('contacts');
                                    setJob({
                                       ...job,
                                       [addressRadio]: {
                                          ...job[addressRadio],
                                          address: ''
                                       }
                                    })
                                 }}
                                 whileHover={{ opacity: 1 }}
                                 role='button'
                              ></motion.i>
                           </div>
                        </div>
                     </motion.div>
                  }
               </AnimatePresence>

               <AnimatePresence mode='wait'>
                  {
                     !address &&
                     <motion.div className='addressInputs position-relative' variants={fadeOutVariants} initial='hidden' animate='visible' exit='hidden'>

                        <p className='fs-smaller text-secondary mb-3'>Search through contacts to auto-fill the address, or select a Google search.</p>

                        {/* RADIO BUTTONS: CONTACT AND GOOGLE SELECTIONS */}
                        <div className='d-flex justify-content-between justify-content-sm-around mb-2'>

                           <div className='d-flex align-items-center gap-2'>
                              <input
                                 checked={searchRadio === 'contacts'}
                                 className='form-check-input fs-smaller cursor-pointer m-0'
                                 id='searchRadioContacts'
                                 onChange={() => setSearchRadio('contacts')}
                                 type='radio'
                              />
                              <label className='form-check-label text-secondary cursor-pointer' htmlFor='searchRadioContacts'>
                                 <SmallHeader text='Contacts' />
                              </label>
                           </div>

                           <div className='d-flex align-items-center gap-2'>
                              <input
                                 checked={searchRadio === 'google'}
                                 className='form-check-input fs-smaller cursor-pointer m-0'
                                 id='searchRadioGoogle'
                                 onChange={() => setSearchRadio('google')}
                                 type='radio'
                              />
                              <label className='form-check-label text-secondary cursor-pointer' htmlFor='searchRadioGoogle'>
                                 <SmallHeader text='Google' />
                              </label>
                           </div>

                           <div className='d-flex align-items-center gap-2'>
                              <input
                                 checked={searchRadio === 'custom'}
                                 className='form-check-input fs-smaller cursor-pointer m-0'
                                 id='searchRadioCustom'
                                 onChange={() => setSearchRadio('custom')}
                                 type='radio'
                              />
                              <label className='form-check-label text-secondary cursor-pointer' htmlFor='searchRadioCustom'>
                                 <SmallHeader text='Custom' />
                              </label>
                           </div>

                        </div>

                        <div className='row'>
                           <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                              <SmallHeader text='Address' isRequired={true} />
                           </div>
                           <div className='col-sm-10'>
                              {
                                 showGoogleAddressSearch &&
                                 <GoogleAddressSelect
                                    address={address}
                                    setAddress={address => {
                                       setJob({
                                          ...job,
                                          [addressRadio]: {
                                             ...job[addressRadio],
                                             address
                                          }
                                       })
                                    }}
                                 />
                              }

                              {
                                 showContactAddressSearch &&
                                 <ContactAddressSelect
                                    placeholder='Required'
                                    setAddress={address => {
                                       console.log(address)
                                       setJob({
                                          ...job,
                                          [addressRadio]: {
                                             ...job[addressRadio],
                                             address
                                          }
                                       })
                                    }}
                                    address={job[addressRadio].address}
                                 />
                              }

                              {
                                 showCustomAddressInput &&
                                 <TextInput
                                    input={addressInput}
                                    onBlur={address => {
                                       setAddressInput('');
                                       setJob({
                                          ...job,
                                          [addressRadio]: {
                                             ...job[addressRadio],
                                             address
                                          }
                                       })
                                    }}
                                    setInput={input => setAddressInput(input)}
                                 />
                              }
                           </div>
                        </div>

                     </motion.div>
                  }
               </AnimatePresence>

            </SectionContainer>

         </div>

         <br />

         {/* TABS FOR OPTIONAL, NOTES, & BILLING */}
         <Tabs tabs={[
            {
               name: 'Optional',
               icon: 'bi bi-plus-slash-minus',
               contentJSX: (
                  <>
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

                     {/* MILEAGE INPUT */}
                     <div className='row'>
                        <div className='col-sm-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                           <SmallHeader text='Mileage' />
                        </div>
                        <div className='col-sm-10'>
                           <TextInput input={job.mileage} setInput={input => setJob(prev => ({ ...prev, mileage: isNaN(input) ? 0 : Number(input) }))} />
                        </div>
                     </div>
                  </>
               )
            },
            {
               name: 'Billing',
               icon: 'bi bi-receipt-cutoff',
               contentJSX: <BillingSelect billing={billing} setBilling={billing => setJob({ ...job, billing })} />
            },
            {
               name: `Note${notes.length > 0 ? 's' : ''}`,
               icon: 'bi bi-sticky',
               contentJSX: (
                  <>
                     <AnimatePresence mode='wait'>
                        {/* BUTTON TO ADD A NOTE TO NOTES */}
                        {
                           showAppendNoteButton &&
                           <motion.button
                              className={addButtonClasses}
                              exit='unmount'
                              initial='mount'
                              onClick={() => {
                                 setShowAppendNoteButton(false);
                                 setJob({
                                    ...job,
                                    notes: [
                                       ...job.notes,
                                       {
                                          attachments: [],
                                          message: '',
                                          createdAt: new Date(),
                                          createdBy: user,
                                       }
                                    ]
                                 })
                              }}
                              type='button'
                              variants={addButtonVariants}
                              whileHover='onHover'
                           >
                              <i className='bi bi-plus'></i>
                              <i className='bi bi-sticky'></i>
                           </motion.button>
                        }
                     </AnimatePresence>
                     {
                        notes.map((note, index) => {
                           const { attachments, message, createdBy, createdAt } = note;

                           return (
                              <NoteInput
                                 attachments={attachments}
                                 createdByName={createdBy.fullName}
                                 createdAtDate={createdAt}
                                 isResizingImages={isResizingImages}
                                 key={note._id || index}
                                 messageInput={message}
                                 setAttachments={attachments => {
                                    setJob({
                                       ...job,
                                       notes: job.notes.map((note, i) => {
                                          if (i === index) note.attachments = attachments;
                                          return note;
                                       })
                                    })
                                 }}
                                 setIsResizingImagesFalse={() => setIsResizingImages(false)}
                                 setIsResizingImagesTrue={() => setIsResizingImages(true)}
                                 setMessageInput={input => {
                                    setJob({
                                       ...job,
                                       notes: job.notes.map((note, i) => {
                                          if (i === index) note.message = input;
                                          return note;
                                       })
                                    });
                                 }}
                              />
                           )
                        })
                     }
                  </>
               )
            },
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