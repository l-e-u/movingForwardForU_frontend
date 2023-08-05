import { useState } from 'react';
import { motion } from 'framer-motion';

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
import { datePrettyString, dateStringFormat, formatCurrency, timeStringFormat } from '../utils/StringUtils';
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

   const tabs = [
      {
         name: 'Info',
         icon: 'bi bi-person-rolodex'
      },
      {
         name: 'Billing',
         icon: 'bi bi-receipt-cutoff'
      },
      {
         name: 'Notes',
         icon: 'bi bi-sticky'
      }
   ];

   // by default, the first tab is to be displayed
   const [selectedTab, setSelectedTab] = useState(tabs[0].name);

   // expands the additional info of a job
   const [expandAdditionalInfo, setExpandAdditionalInfo] = useState(false);

   // formatting strings for date and time
   const balance = formatCurrency(billingTotal(billing), true);
   const pickupTimeString = pickup.includeTime ?
      timeStringFormat({ dateString: pickup.date, showMilitary: true }) :
      '--:--';
   const deliveryTimeString = delivery.includeTime ?
      timeStringFormat({ dateString: delivery.date, showMilitary: true }) :
      '--:--';


   // delete and edit buttons are identical, expandContract button will have the same hover effects, but when its additional info is expanded, it will maintain its hover colors
   const actionButtonVariants = {
      actionButton: {
         background: 'transparent',
         borderWidth: '1px',
         borderStyle: 'solid',
         borderColor: 'var(--bs-secondary)',
         color: 'var(--bs-secondary)',
         scale: 1,
         opacity: 0.5
      },
      expandContractButton: {
         background: 'transparent',
         borderWidth: '1px',
         borderStyle: 'solid',
         borderColor: expandAdditionalInfo ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
         color: expandAdditionalInfo ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
         scale: 1,
         opacity: expandAdditionalInfo ? 1 : 0.5
      },
      onHover: {
         borderColor: 'var(--mainPalette4)',
         color: 'var(--mainPalette4)',
         scale: 1.1,
         opacity: 1,
         transition: {
            duration: 0.2,
         }
      }
   };

   return (
      <div
         className='jobDetails position-relative bg-white container rounded px-4 py-2'
         style={{ boxShadow: '0 .125rem .25rem var(--mainPalette8)' }}
      >

         {/* ACTION BUTTONS: for the document and button to expand the additional info element */}
         <div className='position-absolute top-0 end-0 pt-1 pe-1'>
            {/* delete document button */}
            <motion.button className='rounded' onClick={() => { }} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
               <i className='bi bi-trash3'></i>
            </motion.button>

            {/* edit document button */}
            <motion.button className='rounded mx-4 mx-lg-5' onClick={showEditForm} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
               <i className='bi bi-pencil'></i>
            </motion.button>

            {/* user can expand and contract the additional info element */}
            <motion.button
               className='bg-none rounded'
               onClick={() => setExpandAdditionalInfo(!expandAdditionalInfo)}
               initial='expandContractButton'
               type='button'
               variants={actionButtonVariants}
               whileHover='onHover'
            >
               <i className={`bi bi-chevron-${expandAdditionalInfo ? 'contract' : 'expand'}`}></i>
            </motion.button>
         </div>

         {/* CUSTOMER / CLIENT / ORGANIZATION */}
         <div className='customer name d-xl-flex align-items-baseline gap-2 mb-1'>
            <div className='text-secondary'><SmallHeader text='Customer' /></div>
            <div className='fs-5' style={{ fontWeight: '500' }}>{customer.organization}</div>
         </div>

         {/* DEFAULT VIEW FOR QUICK READING */}
         <div className='row'>

            <div className='col-xl-3 mb-1 my-xl-auto'>
               <div className='my-auto'>
                  {/* STATUS NAME */}
                  <i className='bi bi-stars text-secondary me-2'></i>
                  <span>{status.name}</span>
                  <br />
                  {/* REFERENCE */}
                  <i className='bi bi-hash text-secondary me-2'></i>
                  <span>{reference}</span>
               </div>
            </div>

            {/* PICKUP DETAILS */}
            <div className='col-lg col-xl mb-2 mb-lg-0'>
               <div className='text-secondary mb-1' style={{ opacity: '0.5' }}><SmallHeader text='Pickup Details' /></div>

               <div className='pickup'>
                  <i className='bi bi-clock text-secondary me-2'></i>
                  <span style={{ letterSpacing: '2px' }}>{pickupTimeString}</span>
                  <br />
                  <i className='bi bi-calendar4-event text-secondary me-2'></i>
                  <span className='text-capitalize'>{datePrettyString({ dateString: pickup.date })}</span>
                  <br />
                  <i className='bi bi-geo-alt text-secondary me-2'></i>
                  <span>{pickup.address}</span>
               </div>
            </div>

            {/* DELIVERY DETAILS */}
            <div className='col-lg col-xl'>
               <div className='text-secondary mb-1' style={{ opacity: '0.5' }}><SmallHeader text='Delivery Details' /></div>

               <div className='delivery'>
                  <i className='bi bi-clock text-secondary me-2'></i>
                  <span style={{ letterSpacing: '2px' }}>{deliveryTimeString}</span>
                  <br />
                  <i className='bi bi-calendar4-event text-secondary me-2'></i>
                  <span className='text-capitalize'>{datePrettyString({ dateString: delivery.date })}</span>
                  <br />
                  <i className='bi bi-geo-alt text-secondary me-2'></i>
                  <span>{delivery.address}</span>
               </div>
            </div>
         </div>

         {expandAdditionalInfo &&
            <div className='additionalInfo mt-3'>
               {/* TABS AND CONTENT */}
               <div className='tabs d-flex text-secondary fs-smaller mb-2'>
                  {
                     tabs.map(tab => {
                        const { name, icon } = tab;
                        const isSelected = selectedTab === name;

                        return (
                           <button
                              key={name}
                              className='text-center border-top-0 border-end-0 border-start-0 cursor-pointer flex-grow-1'
                              onClick={() => setSelectedTab(name)}
                              style={{
                                 backgroundColor: isSelected ? 'var(--mainPalette9)' : 'transparent',
                                 borderBottomWidth: '1px',
                                 borderBottomStyle: 'solid',
                                 borderBottomColor: isSelected ? 'var(--mainPalette4)' : 'var(--bs-gray-300)',
                                 color: isSelected ? 'var(--mainPalette4)' : 'inherit',
                                 opacity: isSelected ? '1' : '0.5',
                                 transition: 'all 0.2s ease-in-out'
                              }}
                              type='button'
                           >
                              <i className={icon}></i><span className='ms-2'>{name}</span>
                           </button>
                        )
                     })
                  }
               </div>

               {/* CONTENT 1: THIS IS DISPLAYED WHEN SELECTING TAB 1: INFO */}
               {
                  (selectedTab === tabs[0].name) &&
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
                           {datePrettyString({ dateString: createdAt })}
                        </div>
                     </div>
                  </>
               }
            </div>
         }
      </div>
   );
};

export default JobDetails;