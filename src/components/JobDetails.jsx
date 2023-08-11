import { useState } from 'react';
import { motion } from 'framer-motion';

// components
import EllipsisMenu from './EllipsisMenu';
import SmallHeader from './SmallHeader';
import Tabs from './Tabs';
import TransitDetails from './TransitDetails';

// functions
import { datePrettyString, formatToCurrencyString, timeStringFormat } from '../utils/StringUtils';
import { billingTotal } from '../utils/NumberUtils';


const JobDetails = ({
   job,
   setFilters,
   showEditForm,
   listDrivers = false,
   listBilling = false,
   listMileage = false,
   showCreatedDetails = false,
   singleNoteInput = false,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;
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
   console.log(job)
   // expands the additional info of a job
   const [showMore, setShowMore] = useState(false);

   // formatting strings for date and time
   const pickupTimeString = pickup.includeTime ?
      timeStringFormat({ dateString: pickup.date, showMilitary: true }) :
      '--:--';
   const deliveryTimeString = delivery.includeTime ?
      timeStringFormat({ dateString: delivery.date, showMilitary: true }) :
      '--:--';

   const noDrivers = drivers.length === 0;

   return (
      <div
         className='jobDetails position-relative bg-white container-fluid rounded py-2 border-top-0 border-start-0'
         style={{
            borderRight: '1px solid var(--mainPalette6)',
            borderBottom: '1px solid var(--mainPalette6)'
         }}
      >
         <EllipsisMenu
            actions={[
               {
                  name: showMore ? 'Collapse' : 'Expand',
                  icon: `bi bi-chevron-${showMore ? 'contract' : 'expand'}`,
                  handler: () => setShowMore(!showMore)
               }
            ]}
         />

         {/* DEFAULT VIEW FOR QUICK READING */}
         <div className='row'>
            <div className='col-sm-6 text-secondary'>
               {/* STATUS */}
               <i className='bi bi-stars fs-smaller me-2'></i>
               <span><SmallHeader text={status.name} /></span>
            </div>

            <div className='col-sm-6 text-secondary'>
               {/* REFERENCE */}
               <i className='bi bi-hash fs-smaller me-2'></i>
               <span className='me-3'><SmallHeader text={reference} /></span>
            </div>
         </div>

         {/* ORGANIZATION */}
         <div className='row mb-1'>
            <div className='col-12' style={{ fontWeight: '600' }}>
               {customer.organization}
            </div>
         </div>

         {/* PICKUP AND DELIVERY DETAILS */}
         <div className='row'>
            {/* PICKUP DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <span className='text-secondary' style={{ opacity: '0.5' }}>
                  <SmallHeader text='Pickup Details' />
               </span>

               <TransitDetails
                  address={pickup.address}
                  dateText={datePrettyString({ dateString: pickup.date })}
                  timeText={pickupTimeString}
               />
            </div>

            {/* DELIVERY DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <div className='text-secondary' style={{ opacity: '0.5' }}>
                  <SmallHeader text='Delivery Details' />
               </div>

               <TransitDetails
                  address={delivery.address}
                  dateText={datePrettyString({ dateString: delivery.date })}
                  timeText={deliveryTimeString}
               />
            </div>
         </div>

         {
            showMore &&
            <div className='additionalInfo row mt-3'>
               <div className='col-12'>
                  <Tabs
                     tabs={[
                        {
                           name: 'Info',
                           icon: 'bi bi-person-rolodex',
                           contentJSX: (
                              <>
                                 {/* PARCEL */}
                                 <div className='row mb-1'>
                                    <div className='col-sm-2 text-sm-end text-secondary'>
                                       <SmallHeader text='Parcel' />
                                    </div>
                                    <div className='col-sm-10'>
                                       {parcel}
                                    </div>
                                 </div>
                                 {/* DRIVERS */}
                                 <div className='row mb-1'>
                                    <div className='col-sm-2 text-sm-end text-secondary'>
                                       <SmallHeader text={`Driver${drivers.length > 1 ? 's' : ''}`} />
                                    </div>
                                    <div className='col-sm-10'>
                                       {noDrivers && <div>None assigned</div>}
                                       {
                                          drivers.map(driver => (
                                             <div key={driver._id}>{driver.fullName}</div>
                                          ))
                                       }
                                    </div>
                                 </div>

                                 {/* CREATED BY */}
                                 <div className='row mb-1'>
                                    <div className='col-sm-2 text-sm-end text-secondary'>
                                       <SmallHeader text='Creator' />
                                    </div>
                                    <div className='col-sm-10'>
                                       {createdBy.fullName}
                                    </div>
                                 </div>

                                 {/* CREATED AT */}
                                 <div className='row'>
                                    <div className='col-sm-2 text-sm-end text-secondary'>
                                       <SmallHeader text='Created' />
                                    </div>
                                    <div className='col-sm-10 text-capitalize'>
                                       {datePrettyString({ dateString: createdAt, includeTime: true })}
                                    </div>
                                 </div>
                              </>
                           )
                        },
                        {
                           name: 'Billing',
                           icon: 'bi bi-receipt-cutoff',
                           contentJSX: (
                              <>
                                 <div className='text-end text-secondary mb-2'>
                                    <SmallHeader text={`Balance: $ ${formatToCurrencyString({ amount: billingTotal(billing).toString(), setTwoDecimalPlaces: true })}`} />
                                 </div>
                                 <ul className='p-0 m-0' style={{ listStyle: 'none' }}>
                                    {
                                       billing.map(bill => (
                                          <li key={bill._id} className='d-flex justify-content-between'>
                                             <span>{bill.fee.name}</span>
                                             <span>$ {bill.fee.amount}</span>
                                          </li>
                                       ))
                                    }
                                 </ul>
                              </>
                           )
                        },
                        {
                           name: 'Notes',
                           icon: 'bi bi-sticky',
                           contentJSX: (
                              <>
                                 <div className='text-end text-secondary mb-2'>
                                    <SmallHeader text={`Total: ${notes.length}`} />
                                 </div>
                                 <ul className='notesList p-0 m-0' style={{ listStyle: 'none' }}>
                                    {
                                       notes.map(note => (
                                          <li key={note._id} className='row d-flex justify-content-between'>
                                             <div className='col-sm-6 fs-smaller text-secondary text-capitalize' style={{ opacity: 0.5 }}>
                                                {datePrettyString({ dateString: note.createdAt, includeTime: true })}
                                             </div>

                                             <div className='col-sm-6 fs-smaller text-secondary' style={{ opacity: 0.5 }}>
                                                {note.createdBy.fullName}
                                             </div>

                                             <ul className='attachmentsList col-12 m-0 p-0' style={{ listStyle: 'none' }}>
                                                {
                                                   note.attachments.map(attachment => (
                                                      <li key={attachment._id} className='fs-smaller text-end'>
                                                         <a
                                                            href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                         >
                                                            <span>{attachment.originalname}</span>
                                                            <i className='bi bi-download ps-2 text-secondary'></i>
                                                         </a>
                                                      </li>
                                                   ))
                                                }
                                             </ul>

                                             <div className='col-12 mt-1'>
                                                {note.message}
                                             </div>
                                          </li>
                                       ))
                                    }
                                 </ul>
                              </>
                           )
                        }
                     ]}
                  />
               </div>
            </div>
         }
      </div>
   );
};

export default JobDetails;