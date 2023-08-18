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
   showDeleteForm,
   showEditForm,
   restrictInfo,
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
   const [showMore, setShowMore] = useState(false);

   const noDrivers = drivers.length === 0;

   // formatting strings for date and time
   const pickupTimeString = pickup.includeTime ?
      timeStringFormat({ date: pickup.date, showMilitary: true }) :
      '--:--';
   const deliveryTimeString = delivery.includeTime ?
      timeStringFormat({ date: delivery.date, showMilitary: true }) :
      '--:--';

   // holds ellipsis menu options depending on user roles, by default, everyone can expand for more info
   const ellipsisMenuOptions = [{
      name: showMore ? 'Collapse' : 'Expand',
      icon: `bi bi-chevron-${showMore ? 'contract' : 'expand'}`,
      handler: () => setShowMore(!showMore)
   }];

   // holds the type of tabs and their content depending on user roles, by default, everyone has some access to detailed info and notes
   const tabsAndContentJSX = [
      {
         name: 'Details',
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
               {
                  !restrictInfo &&
                  <>
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
                           {datePrettyString({ date: createdAt, includeTime: true })}
                        </div>
                     </div>
                  </>
               }
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
                  <ul
                     className='notesList p-0 m-0'
                     style={{ listStyle: 'none' }}
                  >
                     {
                        notes.map(note => (
                           <li
                              key={note._id}
                              className='row d-flex justify-content-between mt-3'
                              style={{
                                 borderTop: '1px dotted rgba(var(--bs-secondary-rgb), 0.25)',
                              }}
                           >
                              <div className='col-12 fs-smaller text-secondary text-capitalize mt-2'>
                                 {datePrettyString({ date: note.createdAt, includeTime: true })}
                              </div>

                              <div className='col-12 fs-smaller text-secondary mb-2'>
                                 {note.createdBy.fullName}
                              </div>

                              {
                                 (note.attachments.length > 0) &&
                                 <div className='px-2 mb-2'>
                                    <table className='table table-sm table-borderless text-reset m-0'>
                                       <thead>
                                          <tr className='text-secondary fs-smaller'>
                                             <th className='fw-normal' scope='col' colSpan='2' style={{ opacity: 0.5 }}>
                                                {`Attachment${note.attachments.length > 1 ? 's' : ''}`}
                                             </th>
                                             <th className='fw-normal text-end' colSpan='2' scope='col' style={{ opacity: 0.5 }}>Type</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {
                                             note.attachments.map((attachment, index) => {
                                                const number = index + 1;
                                                const hasNewFile = !!attachment.file;
                                                let fileName = attachment.originalname?.split('.')[0];
                                                let fileType = attachment.contentType?.split('/')[1].toLowerCase();

                                                if (hasNewFile) {
                                                   [fileName, fileType] = attachment.filename.split('.');
                                                };

                                                return (
                                                   <tr key={attachment._id ?? index}>
                                                      <th
                                                         className='fs-smaller fw-normal text-secondary'
                                                         scope='row'
                                                         style={{ opacity: 0.5, fontFamily: 'monospace' }}
                                                      >
                                                         {number.toString().padStart(2, '0')}
                                                      </th>

                                                      <td>
                                                         <a
                                                            className='word-break-all text-reset text-decoration-none'
                                                            href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
                                                            rel='noopener noreferrer'
                                                            target='_blank'
                                                         >
                                                            {fileName}
                                                            <i className='bi bi-download text-secondary ms-2'></i>
                                                         </a>
                                                      </td>

                                                      <td className='text-nowrap text-end align-middle'>
                                                         {fileType}
                                                      </td>
                                                   </tr>
                                                )
                                             })
                                          }
                                       </tbody>
                                    </table>
                                 </div>
                              }

                              <span className='text-secondary' style={{ opacity: 0.5 }}><SmallHeader text='Message' /></span>
                              <div className='col-12 whiteSpace-preWrap'>
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
   ];

   // add opions that the user can select to perform on the document depending on their role/authorization
   // dispatchers get access to all the info and the options are for the dipatch page
   if (!restrictInfo) {
      ellipsisMenuOptions.unshift(
         {
            name: 'Edit',
            icon: 'bi bi-pen',
            handler: showEditForm
         },
         {
            name: 'Delete',
            icon: 'bi bi-trash3',
            handler: showDeleteForm
         }
      );

      tabsAndContentJSX.push({
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
      });
   };

   return (
      <DetailsContainer>
         <EllipsisMenu actions={ellipsisMenuOptions} />

         {/* DEFAULT VIEW FOR QUICK READING */}
         {/* STATUS */}
         <i className='bi bi-stars fs-smaller me-2 text-secondary'></i>
         <span className='text-secondary'><SmallHeader text={status.name} /></span>

         <br />

         {/* REFERENCE */}
         <i className='bi bi-hash fs-smaller me-2 text-secondary'></i>
         <span className='text-secondary'><SmallHeader text={reference} /></span>

         {/* ORGANIZATION */}
         <div className='ms-3 ps-1 my-2' style={{ fontWeight: '600' }}>
            {customer.organization}
         </div>

         {/* PICKUP AND DELIVERY DETAILS */}
         <div className='row mx-2'>
            {/* PICKUP DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <TransitDetails
                  address={pickup.address}
                  dateText={datePrettyString({ date: pickup.date })}
                  heading='Pickup'
                  timeText={pickupTimeString}
               />
            </div>

            {/* DELIVERY DETAILS */}
            <div className='col-sm col-lg col-xl'>
               <TransitDetails
                  address={delivery.address}
                  dateText={datePrettyString({ date: delivery.date })}
                  heading='Delivery'
                  timeText={deliveryTimeString}
               />
            </div>
         </div>

         {/* the following section gets altered depending if this is being used in the jobs page or the dispatch page */}
         <CollapsingSection isExpanded={showMore}>
            <Tabs tabs={tabsAndContentJSX} />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default JobDetails;