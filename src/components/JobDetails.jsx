import { useState } from 'react';

// components
import BillingTable from './BillingTable';
import CollapsingSection from './CollapsingSection';
import DetailsContainer from './DetailsContainer';
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
      <DetailsContainer>
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
         {/* STATUS */}
         <i className='bi bi-stars fs-smaller me-2 text-secondary'></i>
         <span className='text-secondary'><SmallHeader text={status.name} /></span>

         <br />

         {/* REFERENCE */}
         <i className='bi bi-hash fs-smaller me-2 text-secondary'></i>
         <span className='text-secondary'><SmallHeader text={reference} /></span>

         {/* ORGANIZATION */}
         <div className='ms-3 ps-1 mb-2' style={{ fontWeight: '600' }}>
            {customer.organization}
         </div>

         {/* PICKUP AND DELIVERY DETAILS */}
         <div className='row mx-2'>
            {/* PICKUP DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <TransitDetails
                  address={pickup.address}
                  dateText={datePrettyString({ dateString: pickup.date })}
                  heading='Pickup'
                  timeText={pickupTimeString}
               />
            </div>

            {/* DELIVERY DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <TransitDetails
                  address={delivery.address}
                  dateText={datePrettyString({ dateString: delivery.date })}
                  heading='Delivery'
                  timeText={deliveryTimeString}
               />
            </div>
         </div>

         <CollapsingSection maxHeight={'300px'} isExpanded={showMore}>
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
                           <div className='text-end text-secondary'>
                              <SmallHeader text={`Balance: $ ${formatToCurrencyString({ amount: billingTotal(billing).toString(), setTwoDecimalPlaces: true })}`} />
                           </div>

                           {(billing.length > 0) && <BillingTable billing={billing} />}
                        </>
                     )
                  },
                  {
                     name: 'Notes',
                     icon: 'bi bi-sticky',
                     contentJSX: (
                        <>
                           <div className='text-end text-secondary'>
                              <SmallHeader text={`Total: ${notes.length}`} />
                           </div>
                           {
                              (notes.length > 0) &&
                              <ul className='notesList p-0 mx-0 mb-0 mt-1 mt-sm-0' style={{ listStyle: 'none' }}>
                                 {
                                    notes.map(note => (
                                       <li key={note._id} className='row d-flex justify-content-between'>
                                          <div className='col-12 fs-smaller text-secondary text-capitalize' style={{ opacity: 0.5 }}>
                                             {datePrettyString({ dateString: note.createdAt, includeTime: true })}
                                          </div>

                                          <div className='col-12 fs-smaller text-secondary' style={{ opacity: 0.5 }}>
                                             {note.createdBy.fullName}
                                          </div>

                                          <div className='text-secondary mt-1'>
                                             <i className='bi bi-paperclip fs-smaller me-1'></i>
                                             <SmallHeader text={`Attachments: ${note.attachments.length}`} />
                                          </div>

                                          <ul className='attachmentsList row col-12 m-0' style={{ listStyle: 'none' }}>
                                             {
                                                note.attachments.map((attachment, index) => (
                                                   <li key={attachment._id} className='fs-smaller row col-12 mt-1'>
                                                      <div className='col-1 text-end p-0' style={{ fontFamily: 'monospace', opacity: 0.5 }}>
                                                         {index.toString().padStart(2, '0')}
                                                      </div>
                                                      <div className='col-11 ps-3 pe-0'>
                                                         <a
                                                            className='word-break-all'
                                                            href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
                                                            rel='noopener noreferrer'
                                                            target='_blank'
                                                         >
                                                            {attachment.originalname}
                                                         </a>
                                                      </div>
                                                   </li>
                                                ))
                                             }
                                          </ul>

                                          <div className='col-12 whiteSpace-preWrap mt-2'>
                                             {note.message}
                                          </div>
                                       </li>
                                    ))
                                 }
                              </ul>
                           }
                        </>
                     )
                  }
               ]}
            />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default JobDetails;