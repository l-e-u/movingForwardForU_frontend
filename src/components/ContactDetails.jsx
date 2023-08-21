import { useState } from 'react';

// components
import BillingTable from './BillingTable';
import CollapsingSection from './CollapsingSection';
import DetailsContainer from './DetailsContainer';
import EllipsisMenu from './EllipsisMenu';
import SmallHeader from './SmallHeader';
import Tabs from './Tabs';

// utilities
import { datePrettyString, formatToCurrencyString, phoneNumberFormatted } from '../utils/StringUtils';
import { billingTotal } from '../utils/NumberUtils';

const ContactDetails = ({ contact, showDeleteForm, showEditForm }) => {
   const [showMore, setShowMore] = useState(false);

   const {
      address,
      billingAddress,
      createdAt,
      createdBy,
      defaultFees,
      email,
      name,
      note,
      organization,
      phoneExt,
      phoneNumber,
      website
   } = contact;
   const feesAsBillingFormat = defaultFees.map(fee => ({ fee, overrideAmount: null }));

   // styling for the columns
   const firstColumnClasses = 'col-1 d-flex align-items-center justify-content-start fs-smaller text-secondary py-1 mb-auto';
   const secondColumnClasses = 'col-11';

   return (
      <DetailsContainer>
         <EllipsisMenu
            actions={[
               {
                  name: 'Edit',
                  icon: 'bi bi-pen',
                  handler: showEditForm
               },
               {
                  name: 'Delete',
                  icon: 'bi bi-trash3',
                  handler: showDeleteForm
               },
               {
                  name: showMore ? 'Collapse' : 'Expand',
                  icon: `bi bi-chevron-${showMore ? 'contract' : 'expand'}`,
                  handler: () => setShowMore(!showMore)
               }
            ]}
         />

         {/* CREATED ON */}
         <i className='bi bi-person-add fs-smaller text-secondary me-2'></i>
         <span className='text-secondary text-capitalize'>
            <SmallHeader text={datePrettyString({ date: createdAt }).split(',')[1].trim()} />
         </span>

         {/* organization/business name display */}
         <div className='ms-3 ps-1 my-2' style={{ fontWeight: '600' }}>{organization}</div>

         <div className='row mx-2'>
            <div className='col-sm col-lg col-xl'>

               <div className='row g-0'>
                  <div className='text-secondary' style={{ opacity: '0.5' }}>
                     <SmallHeader text='Communications' />
                  </div>

                  <i className={`bi bi-person ${firstColumnClasses}`}></i>
                  <span className={secondColumnClasses}>{name}</span>

                  <i className={`bi bi-telephone ${firstColumnClasses}`}></i>
                  <span className={secondColumnClasses}>
                     {`${phoneNumberFormatted(phoneNumber)}${phoneExt ? ' x' + phoneExt : ''}`}
                  </span>

                  <i className={`bi bi-link-45deg ${firstColumnClasses}`}></i>
                  <a
                     className={secondColumnClasses + ' text-reset'}
                     href={`http://${website}`}
                     rel='noopener noreferrer'
                     target='_blank'
                  >
                     {website}
                  </a>

               </div>

            </div>

            <div className='col-sm col-lg col-xl mt-2 mt-sm-0'>

               <div className='row g-0'>
                  <div className='text-secondary' style={{ opacity: '0.5' }}>
                     <SmallHeader text='Addresses' />
                  </div>

                  <i className={`bi bi-envelope-at ${firstColumnClasses}`}></i>
                  <span className={secondColumnClasses + ' word-break-all'} >{email}</span>

                  <i className={`bi bi-geo-alt ${firstColumnClasses}`}></i>
                  <span className={secondColumnClasses}>{address}</span>

                  <i className={`bi bi-mailbox ${firstColumnClasses}`}></i>
                  <span className={secondColumnClasses}>{billingAddress}</span>

               </div>

            </div>
         </div>


         <CollapsingSection maxHeight='300px' isExpanded={showMore}>
            <Tabs
               tabs={[
                  {
                     name: 'Note',
                     icon: 'bi bi-sticky',
                     contentJSX: <p className='whiteSpace-preWrap m-0'>{note}</p>
                  },
                  {
                     name: 'Fees',
                     icon: 'bi bi-cash-stack',
                     contentJSX: (
                        <>
                           <p className='text-secondary fs-smaller'>
                              When dispatching a job, selecting this contact as a customer will automatically add the following fees to that job's billing.
                           </p>
                           <div className='text-end text-secondary'>
                              <SmallHeader text={`Balance: $ ${formatToCurrencyString({ amount: billingTotal(feesAsBillingFormat).toString(), setTwoDecimalPlaces: true })}`} />
                           </div>

                           {(defaultFees.length > 0) && <BillingTable billing={feesAsBillingFormat} />}
                        </>
                     )
                  }
               ]}
            />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default ContactDetails;