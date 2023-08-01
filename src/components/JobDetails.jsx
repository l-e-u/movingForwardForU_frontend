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
import { dateStringFormat, formatCurrency } from '../utils/StringUtils';
import { billingTotal } from '../utils/NumberUtils';


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
   const sectionIconPairs = new Map([
      ['addresses', 'bi bi-truck'],
      ['notes', 'bi bi-sticky'],
      ['billing', 'bi bi-cash-stack']
   ]);

   // by default, set the first key as the selected section
   const [selectedSection, setSelectedSection] = useState([...sectionIconPairs.keys()][0]);
   const [showEditForm, setShowEditForm] = useState(false);

   // styles for the balance display on third section
   const balance = formatCurrency(billingTotal(billing), true);

   const statsClasses = 'd-flex fs-smaller bg-white text-secondary mt-2 mb-1 rounded-1 text-end px-2';
   const statsStyles = { marginLeft: '-0.5rem', marginRight: '-0.5rem' };

   // styles for the job details card
   const cardClasses = `jobCard rounded-3 sticky-top lightGradient d-flex flex-column shadow-sm`;
   const cardStyles = { backgroundColor: 'var(--mainPalette9)' };

   // styling for input headers
   const headerStyles = { color: 'var(--mainPalette4)', fontWeight: '500' };

   // styling for the first column of job details
   const detailsFirstColumn = 'col-4 text-end';
   const detailsSecondColumn = 'col-8';

   // styling for the hr line separator
   const hrClasses = 'position-absolute d-none d-md-block m-0 top-0 start-50 translate-middle';
   const hrStyles = { color: 'var(--mainPalette8)', width: 'calc(100% - 32px)' };

   // setup for the sections and the buttons to switch between them
   // styling for the section buttons
   const sectionButtonsContainerClasses = 'd-flex justify-content-end gap-2 gap-sm-4 text-secondary';
   const sectionButtonClasses = 'rounded';
   const sectionButtonStyles = {
      background: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
      transition: 'all 0.25s ease-in-out'
   };

   // array that holds the buttons that allows the user to switch between sections
   const sectionButtonsJSX = [];

   const driversJSX = drivers.map(driver => <div key={driver._id}>{driver.fullName}</div>);

   // framer-motion variants for the card, initially it won't have any height, after the children have appeared, it will get 500px in height, and when it exits/unmounts, it fires after the children have faded away
   const expandCollapseVariants = {
      mount: {
         height: '0px',
         padding: '0rem',
         margin: '1rem',
      },
      animation: {
         height: '100%',
         padding: '1rem 0.25rem 0.25rem 0.25rem',
         margin: '1rem',
         transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2
         }
      },
      unmount: {
         height: '0px',
         padding: '0rem',
         margin: '0rem',
         transition: {
            when: 'afterChildren',
         }
      }
   };

   // framer-motion variants for the children containers, on mount, they fade in after the parent has expanded, on unmount, they fade out before the parent
   const fadeInOutVariants = {
      mount: {
         opacity: 0,
      },
      animation: {
         opacity: 1
      },
      unmount: {
         opacity: 0
      }
   };

   // create the sections' buttons
   for (const [sectionName, iconNameClasses] of sectionIconPairs.entries()) {
      const isSelected = sectionName === selectedSection;

      sectionButtonsJSX.push(
         <button
            className={sectionButtonClasses}
            key={sectionName}
            onClick={() => setSelectedSection(sectionName)}
            style={
               {
                  ...sectionButtonStyles,
                  borderColor: isSelected ? 'var(--mainPalette4)' : 'transparent',
                  color: isSelected ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
                  padding: isSelected ? '0 2rem' : '0 1rem'
               }
            }
            type='button'
         >
            <i className={iconNameClasses}></i>
         </button >
      );
   };

   return (
      <motion.div
         className={cardClasses}
         style={cardStyles}
         variants={expandCollapseVariants}
         initial='mount'
         animate='animation'
         exit='unmount'
      >
         {/* organization name of the customer/business */}
         <motion.div className='container-fluid' variants={fadeInOutVariants}>
            <div style={headerStyles}>
               <SmallHeader text='Organization' />
            </div>
            <div className='organization fs-3'>
               {customer.organization}
            </div>
         </motion.div>

         {/* job details and tab/content, this layout swaps from column to row in larger screens */}
         <div className='container-fluid p-0'>
            <div className='row'>

               {/* Job Details */}
               <div className='detailsColumn col-md col-lg-5 d-grid position-relative py-2'>

                  <motion.hr variants={fadeInOutVariants} className={hrClasses} style={hrStyles} />

                  <motion.div variants={fadeInOutVariants} className='container-fluid align-self-center'>

                     {/* status name */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Status' />
                        </div>
                        <div className={detailsSecondColumn}>{status.name}</div>
                     </div>

                     {/* reference number */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Reference' />
                        </div>
                        <div className={detailsSecondColumn}>{reference}</div>
                     </div>

                     {/* driver(s) */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text={`Driver${drivers.length > 1 ? 's' : ''}`} />
                        </div>
                        <div className={detailsSecondColumn}>
                           {driversJSX}
                        </div>
                     </div>

                     {/* parcel */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Parcel' />
                        </div>
                        <div className={detailsSecondColumn}>{parcel}</div>
                     </div>

                     {/* mileage */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Mileage' />
                        </div>
                        <div className={detailsSecondColumn}>{mileage}</div>
                     </div>

                     {/* creator of the job */}
                     <div className='row mb-2'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Creator' />
                        </div>
                        <div className={detailsSecondColumn}>{createdBy.fullName}</div>
                     </div>

                     {/* date and time of creation */}
                     <div className='row'>
                        <div className={detailsFirstColumn} style={headerStyles}>
                           <SmallHeader text='Created' />
                        </div>
                        <div className={detailsSecondColumn}>{dateStringFormat(new Date(createdAt))}</div>
                     </div>

                  </motion.div>
               </div>

               {/* buttons and sections to swap between addresses, notes, and billing */}
               <div className='sectionsColumn col-md col-lg-7'>
                  <motion.div variants={fadeInOutVariants} className='rounded-2 py-2 px-3 h-100' style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>

                     {/* BUTTONS for content selection */}
                     <div className={sectionButtonsContainerClasses}>{sectionButtonsJSX}</div>

                     {/* SECTIONS */}
                     {/* SECTION 1: pickup and delivery addresses */}
                     {(selectedSection === 'addresses') &&
                        <>
                           <div className='text-secondary mb-1'><SmallHeader text='Pickup' /></div>
                           <AddressDisplay
                              address={pickup.address}
                              date={pickup.date}
                              includeTime={pickup.includeTime}
                              heading='Pickup'
                           />
                           <hr />
                           <div className='text-secondary mb-1'><SmallHeader text='Delivery' /></div>
                           <AddressDisplay
                              address={delivery.address}
                              date={delivery.date}
                              includeTime={delivery.includeTime}
                              alignEnd={true}
                              heading='Delivery'
                           />
                        </>
                     }

                     {/* SECTION 2: notes */}
                     {(selectedSection === 'notes') &&
                        <>
                           <div className={statsClasses} style={statsStyles}>
                              <span>{`# of Notes: ${notes.length}`}</span>
                           </div>
                           <NotesList list={notes} />
                        </>
                     }

                     {/* SECTION 3: billing */}
                     {(selectedSection === 'billing') &&
                        <>
                           <div className={statsClasses} style={statsStyles}>
                              <span>{`# of Fees: ${billing.length}`}</span><span className='ms-auto'>{`Balance: $${balance}`}</span>
                           </div>
                           <FeesList billing={billing} />
                        </>
                     }

                  </motion.div>
               </div>

            </div>
         </div>
      </motion.div >
   );
};

export default JobDetails;