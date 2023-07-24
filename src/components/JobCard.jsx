// components
import AddressDisplay from './AddressDisplay';
import Card from './Card';
import Counter from './Counter';
import CreatedInfo from './CreatedInfo';
import DriversList from './DriversList';
import DriverNoteInput from './DriverNoteInput';
import FeesList from './FeesList';
import NotesList from './NotesList';
import SmallHeader from './SmallHeader';

// functions
import { formatCurrency } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const JobCard = ({
   _id,
   billing,
   createdAt,
   createdBy,
   customer,
   delivery,
   drivers,
   mileage,
   notes,
   pickup,
   parcel,
   reference,
   status,
   listDrivers = false,
   listBilling = false,
   listMileage = false,
   showCreatedDetails = false,
   singleNoteInput = false,
}) => {
   const hasDrivers = drivers.length > 0;
   const numOfBills = billing.length;
   const hasBilling = numOfBills > 0;
   const numOfNotes = notes.length;
   const hasNotes = numOfNotes > 0;

   console.log(notes)

   return (
      <Card
         header={<>
            <div className='mb-2'>{status.name}</div>
            <div className='d-flex d-md-block flex-wrap justify-content-between gap-2'>
               <h2 className='fs-5 m-0'>{customer.organization}</h2>
               {reference && <small className='text-action text-end align-self-end flex-grow-1'>{reference}</small>}
            </div>
         </>}

         body={<div className='d-flex flex-column gap-2'>
            {listDrivers &&
               <div>
                  <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                  {hasDrivers ? <DriversList list={drivers} /> : <div>No drivers have been assigned.</div>}
               </div>
            }


            {/* pickup and delivery addresses */}
            <div className='d-flex flex-column flex-md-row justify-content-between gap-4'>
               <AddressDisplay
                  address={pickup.address}
                  date={pickup.date}
                  includeTime={pickup.includeTime}
                  heading='Pickup'
               />
               <AddressDisplay
                  address={delivery.address}
                  date={delivery.date}
                  includeTime={delivery.includeTime}
                  alignEnd={true}
                  heading='Delivery'
               />
            </div>

            <hr className='m-0' />

            {/* parcel and mileage */}
            <div className='d-flex flex-column gap-2 flex-sm-row justify-sm-content-between'>
               {parcel &&
                  <div className='flex-grow-1'>
                     <SmallHeader text='Parcel' />
                     {parcel}
                  </div>
               }
               {listMileage &&
                  <div className={'flex-grow-1' + (parcel ? ' text-end' : '')}>
                     <SmallHeader text='Mileage' />
                     {mileage}
                  </div>
               }
            </div>
            <div className='d-lg-flex gap-lg-5'>
               {listBilling &&
                  <div className='w-lg-50 order-lg-last'>
                     <div className='d-flex gap-1'>
                        <SmallHeader text='Billing' />
                        {hasBilling && <>
                           <Counter number={numOfBills} />
                           <small className='text-secondary smallPrint ms-auto'>&#8224; adjusted amount</small>
                        </>}
                     </div>
                     {hasBilling && <>
                        <FeesList billing={billing} />
                        <div className='d-flex align-items-center justify-content-end mt-1'>
                           <SmallHeader text='Total' />
                           <span className='border-top ms-2 ps-2'>{'$ ' + formatCurrency(billing.reduce((total, bill) => addTwoCurrencies(total, (bill.adjustedAmount === null ? bill.fee.amount : bill.adjustedAmount)), 0), true)}</span>
                        </div>
                     </>}

                     {!hasBilling && <div>No fees has been assessed.</div>}
                  </div>
               }

               <div className={'order-lg-first' + (listBilling ? ' w-lg-50' : ' flex-grow-1')}>
                  <div className='d-flex gap-1'>
                     <SmallHeader text={'Note' + ((notes.length > 1) ? 's' : '')} />
                     {(hasNotes && numOfNotes > 1) && <Counter number={numOfNotes} />}
                  </div>
                  {hasNotes ? <NotesList list={notes} /> : <div>No notes have been appended.</div>}

                  {/* driver can add one note at a time */}
                  {singleNoteInput &&
                     <>
                        <br />
                        <DriverNoteInput job_id={_id} />
                     </>
                  }
               </div>
            </div>
         </div>}

         footer={showCreatedDetails && <CreatedInfo createdBy={createdBy} createdAt={createdAt} />}
      />
   );
};

export default JobCard;