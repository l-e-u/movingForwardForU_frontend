import { useState } from 'react';

// components
import ActionButton from './ActionButton';
import AddressDisplay from './AddressDisplay';
import Counter from './Counter';
import CreatedInfo from './CreatedInfo';
import DriversList from './DriversList';
import DriverNoteInput from './DriverNoteInput';
import EditJobForm from './EditJobForm';
import FeesList from './FeesList';
import NotesList from './NotesList';
import SmallHeader from './SmallHeader';

// functions
import { formatCurrency } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const JobDetails = ({
   job,
   setFilters,
   listDrivers = false,
   listBilling = false,
   listMileage = false,
   showCreatedDetails = false,
   singleNoteInput = false,
}) => {
   const {
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
      status
   } = job;
   const [selectedTab, setSetselectedTab] = useState(0);
   const [showEditForm, setShowEditForm] = useState(false);

   const tabNames = ['Transport', 'Details', 'Notes', 'Billing'];
   const hasDrivers = drivers.length > 0;
   const numOfBills = billing.length;
   const hasBilling = numOfBills > 0;
   const numOfNotes = notes.length;
   const hasNotes = numOfNotes > 0;

   // styling for the buttons that switches between tab sections
   const tabButtonClasses = 'text-secondary postion-relative border-top-0 border-start-0 border-end-0 p-0 mx-2 mx-md-3 mx-lg-4';
   const tabButtonStyles = { backgroundColor: 'transparent', borderBottomColor: 'transparent' };

   // styling for the containers of the tab content
   const tabContentClasses = 'rounded bg-white p-3';
   const tabContentStyles = {};

   // buttons that switch between section's content
   const tabButtonsJSX = tabNames.map((tabName, index) => {
      return (
         <button
            className={`${tabButtonClasses}${index === selectedTab ? ' selected' : ''}`}
            key={tabName}
            onClick={() => setSetselectedTab(index)}
            style={tabButtonStyles}
            type='button'
         >
            <SmallHeader text={tabName} />
         </button>
      )
   });

   let additionalDriversJSX = null;

   // if there's 2 drivers or more, it will add more rows to preserve the table format
   if (drivers.length > 1) {
      additionalDriversJSX = [];

      for (let x = 1; x < drivers.length; x++) {
         additionalDriversJSX.push(
            <tr key={drivers[x].email}>
               <td className='py-1'></td>
               <td className='py-1 ps-4'>{drivers[x].fullName}</td>
            </tr>
         );
      };
   };

   return (
      <div className='jobDetailsCard px-4 pt-3'>

         {/* status and reference are always showing */}
         <table className='mb-1'>
            <tbody>
               <tr>
                  <td className='py-0'> <SmallHeader text='Status' /></td>
                  <td className='py-0 ps-4'>{status.name}</td>
               </tr>
               <tr>
                  <td className='py-0'> <SmallHeader text='Reference' /></td>
                  <td className='py-0 ps-4'>{reference}</td>
               </tr>
            </tbody>
         </table>

         {/* organization name of the customer/business */}
         <div className='organization fs-3 mb-2'>{customer.organization}</div>

         <div className='sections'>
            {/* buttons to navigate the sections */}
            <div className='tabs d-flex ps-2'>
               {tabButtonsJSX}
            </div>

            {/* second tab content is details */}
            {(selectedTab === 0) &&
               <div className={tabContentClasses} style={tabContentStyles}>
                  {/* pickup and delivery addresses */}
                  <SmallHeader text='Pickup' />
                  <AddressDisplay
                     address={pickup.address}
                     date={pickup.date}
                     includeTime={pickup.includeTime}
                     heading='Pickup'
                  />
                  <hr />
                  <SmallHeader text='Delivery' />
                  <AddressDisplay
                     address={delivery.address}
                     date={delivery.date}
                     includeTime={delivery.includeTime}
                     alignEnd={true}
                     heading='Delivery'
                  />
               </div>
            }

            {/* first tab content is transport */}
            {(selectedTab === 1) &&
               <div className={tabContentClasses} style={tabContentStyles}>
                  <table>
                     <tbody>
                        <tr>
                           <td className='py-1'><SmallHeader text={`Driver${hasDrivers ? 's' : ''}`} /></td>
                           <td className='py-1 ps-4'>{hasDrivers ? drivers[0].fullName : ''}</td>
                        </tr>
                        {additionalDriversJSX}
                        <tr >
                           <td className='py-1'><SmallHeader text='Mileage' /></td>
                           <td className='py-1 ps-4'>{mileage}</td>
                        </tr>
                        <tr >
                           <td className='py-1'><SmallHeader text='Parcel' /></td>
                           <td className='py-1 ps-4'>{parcel}</td>
                        </tr>
                        <tr >
                           <td className='py-1'><SmallHeader text='Created By' /></td>
                           <td className='py-1 ps-4'>{createdBy.fullName}</td>
                        </tr>
                        <tr >
                           <td className='py-1'><SmallHeader text='Created At' /></td>
                           <td className='py-1 ps-4'>{new Date(createdAt).toDateString()}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            }

            {(selectedTab === 2) &&
               <div className={tabContentClasses} style={tabContentStyles}>
                  <NotesList list={notes} />
               </div>
            }

            {(selectedTab === 3) &&
               <div className={tabContentClasses} style={tabContentStyles}>
                  <FeesList billing={billing} />
               </div>
            }
         </div>

         <ActionButton
            alignX='right'
            invertedColors={true}
            handleOnClick={() => setShowEditForm(true)}
            text='Edit'
         />
         {/* 
   
         {singleNoteInput &&
            <>
               <br />
               <DriverNoteInput job_id={_id} />
            </>
         } */}

         {showEditForm &&
            <EditJobForm preJob={job} setShowThisForm={setShowEditForm} callBack={() => setFilters(prev => ({ ...prev }))} />
         }

      </div>
   );
};

export default JobDetails;