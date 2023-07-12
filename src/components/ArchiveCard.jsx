import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// components
import ActionButton from './ActionButton';
import ArchiveHeader from './ArchiveHeader';
import CreatedInfo from './CreatedInfo';
import GrowingTextArea from './GrowingTextArea';
import XButton from './XButton';

// functions
import { formatCurrency } from '../utils/StringUtils';

// context
import { useArchivesContext } from '../hooks/useArchiveContext';
import { useAuthContext } from '../hooks/useAuthContext';

const ArchiveCard = ({
   _id,
   amendments,
   billing,
   createdAt,
   createdOn,
   delivery,
   drivers,
   mileage,
   notes,
   organization,
   pickup,
   parcel,
   reference,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { dispatch } = useArchivesContext();
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const [input, setInput] = useState('');
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);

   const pickupDate = new Date(pickup.date);
   const deliveryDate = new Date(delivery.date);

   return (
      <div className='position-relative background-white shadow-sm pb-1 px-4 pt-3 rounded' style={{ fontFamily: 'monospace' }}>
         <ActionButton
            alignX='right'
            handleOnClick={() => setShowDeleteConfirmation(true)}
            text='Delete'
         />
         {/* click for permanent delete confirmation */}
         {showDeleteConfirmation &&
            <CSSTransition
               appear={true}
               classNames='scale-'
               in={true}
               timeout={500}
            >
               <div
                  className='shadow position-absolute mx-auto background-navy text-white rounded p-4'
                  style={{ left: '50%', top: '.5rem', transform: 'translateX(-50%)', width: '90%' }}
               >
                  <div className='position-absolute top-0 end-0 p-2'><XButton handleOnClick={() => setShowDeleteConfirmation(false)} /></div>
                  <h2 className='fs-5'>Delete?</h2>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{"This will permanently delete the archive, along with it's attachments. This action cannot be undone.\nAre you sure you want to delete?"}</p>

                  <ActionButton
                     alignX='right'
                     isDisabled={isLoading}
                     isLoading={isLoading}
                     handleOnClick={async () => {
                        setIsLoading(true);

                        // don't want to show the error if the user is trying to rectify, so null error at the start
                        setError(null);

                        const response = await fetch(`${API_BASE_URL}/api/archives/` + _id, {
                           method: 'DELETE',
                           headers: { 'Authentication': `Bearer ${user.token}` }
                        });

                        // expecting the newly created status
                        const json = await response.json();

                        if (!response.ok) {
                           console.error(json);

                           setError(json.error);
                           setIsLoading(false);
                        };

                        if (response.ok) {
                           setError(null);
                           setIsLoading(false);
                           setShowDeleteConfirmation(false);
                           dispatch({ type: 'DELETE_ARCHIVE', payload: json })
                        };
                     }}
                     text={isLoading ? 'Deleting...' : 'Confirm'}
                  />
               </div>
            </CSSTransition>
         }

         {/* main info, on large screens these flex to side-by-side */}
         <div className='d-lg-flex'>
            <div className='flex-grow-1'>
               <ArchiveHeader text='Customer' /><span>{organization}</span><br />
               <ArchiveHeader text='Reference' /><span>{reference || '<empty>'}</span><br />
               <ArchiveHeader text='Driver(s)' />
               <ul className='mb-1'>
                  {drivers.map((driver, index) => <li key={index}><span className='me-2'>{driver.name}</span><span className='text-break'>{`(${driver.email})`}</span></li>)}
               </ul>
               <ArchiveHeader text='Parcel' /><span>{parcel || '<empty>'}</span><br />
               <ArchiveHeader text='Mileage' /><span>{mileage}</span><br />
               <ArchiveHeader text='Created_On' /><span>{new Date(createdOn).toString()}</span><br />
            </div>

            <div className='flex-grow-1'>
               <ArchiveHeader text='Pickup' />
               <ul className='mb-1'>
                  <li> <ArchiveHeader text='Address' /><span>{pickup.address}</span></li>
                  <li> <ArchiveHeader text='Date' /><span>{pickupDate.toDateString()}</span></li>
                  <li> <ArchiveHeader text='Time' /><span>{pickup.includeTime ? pickupDate.toTimeString() : '<n/a>'}</span></li>
               </ul>
               <ArchiveHeader text='Delivery' />
               <ul className='mb-1'>
                  <li><ArchiveHeader text='Address' /><span>{delivery.address}</span></li>
                  <li><ArchiveHeader text='Date' /><span>{deliveryDate.toDateString()}</span></li>
                  <li><ArchiveHeader text='Time' /><span>{delivery.includeTime ? deliveryDate.toTimeString() : '<n/a>'}</span></li>
               </ul>
            </div>
         </div >

         {/* notes  list */}
         <ArchiveHeader text='Note(s)' />
         <ol>
            {notes.map((note, index) => {
               const { attachments } = note;
               const noteDate = new Date(note.createdOn);

               return (
                  <li key={index} className='mb-3'>
                     <ArchiveHeader text='Subject' />
                     <span>{note.subject}</span><br />
                     <ArchiveHeader text='Message' />
                     <span>{note.message}</span><br />
                     <ArchiveHeader text='Attachment(s)' />
                     {attachments.length === 0 ?
                        <><span>{'<none>'}</span><br /></> :
                        <ol>
                           {attachments.map((attachment, index) => {
                              return (
                                 <li key={index}>
                                    <ArchiveHeader text='Image' />
                                    <a
                                       href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
                                       rel='noreferrer'
                                       target='_blank'
                                    >
                                       <span>{attachment.originalname}</span>
                                    </a>
                                 </li>
                              )
                           })}
                        </ol>
                     }
                     <ArchiveHeader text='Created_By' />
                     <span>{note.createdBy}</span><br />
                     <ArchiveHeader text='Created_On' />
                     <span>{noteDate.toString()}</span>
                  </li>
               )
            })}
         </ol>

         {/* billing list */}
         <ArchiveHeader text='Billing' /><span className='text-primary'>(* adjusted)</span>
         <ol className='d-md-flex flex-wrap gap-3'>
            {billing.map((bill, index) => {
               const { baseAmount, feeName, finalAmount } = bill;

               return (
                  <li key={index} className='me-md-5 mb-3 mb-md-0'>
                     <ArchiveHeader text='Fee' />
                     <span>{feeName}</span><br />
                     <ArchiveHeader text='Amount' />
                     <ol>
                        <li>
                           <ArchiveHeader text='Original' />
                           <span>{'$' + formatCurrency(baseAmount, true)}</span><br />
                        </li>
                        <li>
                           <ArchiveHeader text='Final' />
                           <span>{'$' + formatCurrency(finalAmount, true)}</span>
                           {(baseAmount !== finalAmount) && <span className='text-primary ms-1'>*</span>}
                           <br />
                        </li>
                     </ol>
                  </li>
               )
            })}
         </ol>

         <ArchiveHeader text='Amendments' />
         <ol>
            {amendments.map((amendment, index) => {
               return (
                  <CSSTransition
                     appear={true}
                     classNames='fade-'
                     in={true}
                     key={index}
                     timeout={500}
                  >
                     <li className='outline py-1 px-3 mb-3'>
                        <p className='mb-1' style={{ whiteSpace: 'pre-wrap' }}>{amendment.text}</p>
                        <div className='text-end'> <CreatedInfo createdBy={amendment.createdBy} createdAt={amendment.createdAt} /></div>
                     </li>
                  </CSSTransition>
               )
            })}
         </ol>

         {/* update the archive by appending an amendment */}
         {!showDeleteConfirmation &&
            <form onSubmit={async (e) => {
               e.preventDefault();

               setIsLoading(true);

               // don't want to show the error if the user is trying to rectify, so null error at the start
               setError(null);

               const response = await fetch(`${API_BASE_URL}/api/archives/` + _id, {
                  method: 'PATCH',
                  body: JSON.stringify({ text: input }),
                  headers: { 'Authentication': `Bearer ${user.token}`, 'Content-Type': 'application/json' }
               });

               // expecting the newly created status
               const json = await response.json();

               if (!response.ok) {
                  console.error(json);

                  setError(json.error);
                  setIsLoading(false);
               };

               if (response.ok) {
                  setError(null);
                  setIsLoading(false);
                  setInput('');
                  dispatch({ type: 'UPDATE_ARCHIVE', payload: json })
               };
            }}
            >
               <GrowingTextArea
                  className='form-control my-3'
                  onBlur={e => setInput(e.target.value.trim())}
                  onChange={e => setInput(e.target.value)}
                  placeholder='Add a new amendment...'
                  value={input}
               />

               {error && <p>Oops! Somethingt went wrong. Refresh and try again.</p>}

               <ActionButton
                  alignX='right'
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  text={isLoading ? 'Saving...' : 'Save'}
                  type='submit'
               />
            </form>
         }

         {/* date on the archive's creation is always listed at the bottom */}
         <div className='text-end mt-3'><CreatedInfo createdAt={createdAt} /></div>
      </div >
   );
};

export default ArchiveCard;