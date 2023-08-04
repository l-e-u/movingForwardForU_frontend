import { useState } from 'react';
import { motion } from 'framer-motion';

// components
import SmallHeader from './SmallHeader';

// utilities
import { formatCurrency, phoneNumberFormatted } from '../utils/StringUtils';

const ContactDetails = ({ contact, showEditForm }) => {
   const [expandAdditionalInfo, setExpandAdditionalInfo] = useState(false);

   const {
      address,
      billingAddress,
      defaultFees,
      email,
      note,
      organization,
      phoneExt,
      phoneNumber
   } = contact;

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
         borderColor: 'var(--mainPalette4) !important',
         color: 'var(--mainPalette4) !important',
         scale: 1.1,
         opacity: 1,
         transition: {
            duration: 0.2,
         }
      }
   };

   return (
      <div
         className='contactDetails position-relative bg-white container rounded pt-2 pb-1 px-4'
         style={{ boxShadow: '0 .125rem .25rem var(--mainPalette8)' }}
      >

         {/* contains all actions for the document and button to expand the additional info element */}
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

         {/* organization/business name display */}
         <div className='organization d-xl-flex align-items-baseline gap-2 mb-2'>
            <div className='text-secondary'><SmallHeader text='Organization' /></div>
            <div className='fs-5' style={{ fontWeight: '500' }}>{organization}</div>
         </div>


         {/* address, phone, and email, this layout will flex depending on the screen size */}
         <div className='row pb-2'>
            <div className='address col-lg d-flex gap-2 justify-content-lg-center mb-2 mb-lg-0'>
               <i className='bi bi-geo-alt text-secondary'></i>
               <div>{address}</div>
            </div>

            <div className='phone col-lg d-flex gap-2 justify-content-lg-center mb-2 mb-lg-0'>
               <i className='bi bi-telephone text-secondary'></i>
               <div>
                  {`${phoneNumberFormatted(phoneNumber)}${phoneExt ? ' x' + phoneExt : ''}`}
               </div>
            </div>

            <div className='email col-lg d-flex gap-2 justify-content-lg-center'>
               <i className='bi bi-envelope-at text-secondary'></i>
               <div className='word-break-all'>{email}</div>
            </div>
         </div>

         {expandAdditionalInfo &&
            <div
               className='additionalInfo rounded-bottom pt-2 px-4 pb-3'
               style={{
                  background: 'linear-gradient(to top, var(--bs-gray-200), var(--bs-gray-100))',
                  marginRight: '-1.25rem',
                  marginLeft: '-1.25rem'
               }}
            >
               <div className='row mb-2'>
                  <div className='col-md-2 text-md-end text-secondary'><SmallHeader text='Default Fees' /></div>
                  <div className='col-md-10'>
                     {
                        defaultFees.map(fee => (
                           <div key={fee._id}>
                              <span>{fee.name}</span><span>{'$ ' + formatCurrency(fee.amount, true)}</span>
                           </div>
                        ))
                     }
                  </div>
               </div>

               <div className='row mb-2'>
                  <div className='col-md-2 text-md-end text-secondary'><SmallHeader text='Billing' /></div>
                  <div className='col-md-10'>{billingAddress}</div>
               </div>

               <div className='row'>
                  <div className='col-md-2 text-md-end text-secondary'><SmallHeader text='Note' /></div>
                  <div className='col-md-10 whiteSpace-preWrap'>{note}</div>
               </div>
            </div>
         }
      </div>
   );
};

export default ContactDetails;