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

const JobDetails = ({
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
      <div className='jobDetailsCard p-4'>
         <div className='organization fs-3'>{customer.organization}</div>

         <div className='status d-flex gap-2 align-items-end'>
            <SmallHeader text='Status:' />
            <div>{status.name}</div>
         </div>

         <div className='reference d-flex gap-2 align-items-end'>
            <SmallHeader text='Reference:' />
            <div>{reference}</div>
         </div>






         {listDrivers &&
            <div>
               <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
               {hasDrivers ? <DriversList list={drivers} /> : <div>No drivers have been assigned.</div>}
            </div>
         }


         {/* pickup and delivery addresses */}
         <SmallHeader text='Pickup Details:' />
         <AddressDisplay
            address={pickup.address}
            date={pickup.date}
            includeTime={pickup.includeTime}
            heading='Pickup'
         />

         <SmallHeader text='Delivery Details:' />
         <AddressDisplay
            address={delivery.address}
            date={delivery.date}
            includeTime={delivery.includeTime}
            alignEnd={true}
            heading='Delivery'
         />

         <div>Parcel</div>
         <div>{parcel}</div>

         {listMileage &&
            <div className={'flex-grow-1' + (parcel ? ' text-end' : '')}>
               <SmallHeader text='Mileage' />
               {mileage}
            </div>
         }




         {listBilling &&
            <div>
               {hasBilling && <>
                  <Counter number={numOfBills} />
                  <small className='text-secondary smallPrint ms-auto'>&#8224; adjusted amount</small>
               </>}

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



         {hasNotes ? <NotesList list={notes} /> : <div>No notes have been appended.</div>}

         {/* driver can add one note at a time */}
         {singleNoteInput &&
            <>
               <br />
               <DriverNoteInput job_id={_id} />
            </>
         }


         {showCreatedDetails && <CreatedInfo createdBy={createdBy} createdAt={createdAt} />}
      </div>
   );
};

export default JobDetails;