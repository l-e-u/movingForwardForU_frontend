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

const ContactDetails = ({ contact, showEditForm }) => {
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
      phoneNumber
   } = contact;
   const feesAsBillingFormat = defaultFees.map(fee => ({ fee, overrideAmount: null }));

   // styling for the columns
   const firstColumnClasses = 'col-sm-2 text-secondary text-sm-end';
   const secondColumnClasses = 'col-sm-10'

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
                  name: showMore ? 'Collapse' : 'Expand',
                  icon: `bi bi-chevron-${showMore ? 'contract' : 'expand'}`,
                  handler: () => setShowMore(!showMore)
               }
            ]}
         />

         {/* organization/business name display */}
         <div className='mb-2' style={{ fontWeight: '600' }}>{organization}</div>

         {/* DEFAULT VIEW FOR QUICK READING */}
         {/* address, phone, and email, this layout will flex depending on the screen size */}
         <div className='row px-1 px-sm-3 px-md-4 px-lg-1'>
            <div className='address col-lg d-flex gap-2 justify-content-lg-center align-items-center mb-1 mb-lg-0'>
               <i className='bi bi-geo-alt text-secondary fs-smaller'></i>
               <div>{address}</div>
            </div>

            <div className='phone col-lg d-flex gap-2 justify-content-lg-center align-items-center mb-1 mb-lg-0'>
               <i className='bi bi-telephone text-secondary fs-smaller'></i>
               <div>
                  {`${phoneNumberFormatted(phoneNumber)}${phoneExt ? ' x' + phoneExt : ''}`}
               </div>
            </div>

            <div className='email col-lg d-flex gap-2 justify-content-lg-center align-items-center'>
               <i className='bi bi-envelope-at text-secondary fs-smaller'></i>
               <div className='word-break-all'>{email}</div>
            </div>
         </div>

         <CollapsingSection maxHeight='300px' isExpanded={showMore}>
            <Tabs
               tabs={[
                  {
                     name: 'Details',
                     icon: 'bi bi-person-rolodex',
                     contentJSX: (
                        <>
                           {/* BILLING ADDRESS */}
                           <div className='row px-2 mb-2'>
                              <div className={firstColumnClasses}><SmallHeader text='Billing' /></div>
                              <div className={secondColumnClasses}>{billingAddress}</div>
                           </div>

                           {/* NAME */}
                           <div className='row px-2 mb-2'>
                              <div className={firstColumnClasses}><SmallHeader text='Name' /></div>
                              <div className={secondColumnClasses}>{name}</div>
                           </div>

                           {/* CREATOR */}
                           <div className='row px-2 mb-2'>
                              <div className={firstColumnClasses}><SmallHeader text='Creator' /></div>
                              <div className={secondColumnClasses}>{createdBy.fullName}</div>
                           </div>

                           {/* CREATED */}
                           <div className='row px-2'>
                              <div className={firstColumnClasses}><SmallHeader text='Created' /></div>
                              <div className={secondColumnClasses}>{datePrettyString({ dateString: createdAt, includeTime: true })}</div>
                           </div>

                        </>
                     )
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
                  },
                  {
                     name: 'Note',
                     icon: 'bi bi-sticky',
                     contentJSX: <p className='whiteSpace-preWrap m-0'>{note}</p>
                  }
               ]}
            />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default ContactDetails;