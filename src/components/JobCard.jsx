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
   const { archive } = job;

   let {
      billing,
      createdAt,
      createdBy,
      customer,
      delivery,
      drivers,
      isArchived,
      notes,
      pickup,
      reference,
      status
   } = job;

   // reset the billing if this job is archived
   if (isArchived) billing = archive.billing;

   const [sectionExpanded, setSectionExpanded] = useState(false);

   const jobDetailsProps = {
      ...job,
      createdAt: showCreatedAt ? createdAt : null,
      createdBy: showCreatedBy ? createdBy : null,
      drivers: showDrivers ? drivers : null,
   };

   // when the job is archived and user is on the Archives page, ensure to use the archive properties and format them so Job Details can read them
   if (isArchived) {
      jobDetailsProps.createdAt = archive.date;
      jobDetailsProps.createdBy = { fullName: archive.createdBy };
      jobDetailsProps.drivers = archive.drivers.map(driver => ({ fullName: driver }));
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
         {/* STATUS OR ARCHIVED DATE */}
         <i className={`bi bi-${isArchived ? 'archive' : 'stars'} fs-smaller me-2 text-secondary`}></i>
         <span className='text-secondary text-capitalize'>
            <SmallHeader text={isArchived ? datePrettyString({ date: archive.date }) : status.name} />
         </span>

         <br />

         {/* REFERENCE */}
         <i className='bi bi-hash fs-smaller me-2 text-secondary'></i>
         <span className='text-secondary'><SmallHeader text={reference} /></span>

         {/* ORGANIZATION */}
         <div className='ms-3 ps-1 my-2' style={{ fontWeight: '600' }}>
            {isArchived ? archive.customer : customer.organization}
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