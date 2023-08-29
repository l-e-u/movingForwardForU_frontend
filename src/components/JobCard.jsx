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

// hooks
import NotesList from './NotesList';
import JobDetails from './JobDetails';

const JobCard = ({
   documentActions,
   job,
   showBilling,
   showCreatedAt,
   showCreatedBy,
   showDetails,
   showDrivers,
   showNotes
}) => {
   const {
      billing,
      createdAt,
      createdBy,
      customer,
      delivery,
      drivers,
      notes,
      pickup,
      reference,
      status
   } = job;

   const [sectionExpanded, setSectionExpanded] = useState(false);

   const jobDetailsProps = {
      ...job,
      createdAt: showCreatedAt ? createdAt : null,
      createdBy: showCreatedBy ? createdBy : null,
      drivers: showDrivers ? drivers : null,
   };

   // formatting strings for date and time
   const pickupTimeString = pickup.includeTime ?
      timeStringFormat({ date: pickup.date, showMilitary: true }) :
      '--:--';
   const deliveryTimeString = delivery.includeTime ?
      timeStringFormat({ date: delivery.date, showMilitary: true }) :
      '--:--';

   // document options depend on the current page, and everyone has access to expand the element for more info
   const ellipsisMenuOptions = [
      ...documentActions,
      {
         name: sectionExpanded ? 'Collapse' : 'Expand',
         icon: `chevron-${sectionExpanded ? 'contract' : 'expand'}`,
         handler: () => setSectionExpanded(!sectionExpanded)
      }
   ];

   const getTabsAndContent = () => {
      const JSX = [];

      if (showDetails) {
         JSX.push({
            name: 'Details',
            icon: 'person-rolodex',
            contentJSX: (<JobDetails {...jobDetailsProps} />)
         });
      };

      if (showNotes) {
         JSX.push({
            name: 'Notes',
            icon: 'sticky',
            contentJSX: (
               <>
                  <div className='text-end text-secondary'>
                     <SmallHeader text={`Total: ${notes.length}`} />
                  </div>
                  {
                     (notes.length > 0) && <NotesList notes={notes} />
                  }
               </>
            )
         });
      };

      if (showBilling) {
         JSX.push({
            name: 'Billing',
            icon: 'receipt-cutoff',
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

      return JSX;
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
            <div className='col-sm col-lg col-xl mt-2 mt-sm-0'>
               <TransitDetails
                  address={delivery.address}
                  dateText={datePrettyString({ date: delivery.date })}
                  heading='Delivery'
                  timeText={deliveryTimeString}
               />
            </div>
         </div>

         {/* the following section gets altered depending if this is being used in the jobs page or the dispatch page */}
         <CollapsingSection isExpanded={sectionExpanded}>
            <Tabs tabs={getTabsAndContent()} />
         </CollapsingSection>
      </DetailsContainer>
   );
};

export default JobCard;