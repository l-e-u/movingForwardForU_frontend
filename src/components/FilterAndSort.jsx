import { motion } from 'framer-motion';
import { useState } from 'react';

// components
import FilterCustomers from './FilterCustomers';
import FilterDrivers from './FilterDrivers';
import FilterStatuses from './FilterStatuses';

// functions
import { dateObjectToFormattedString__YYYY_MM_DD } from '../utils/StringUtils';

// components
import Button from './Button';
import FilterFees from './FilterFees';
import FormHeader from './FormHeader';
import Modal from './Modal';
import SmallHeader from './SmallHeader';
import Tabs from './Tabs';
import TextInput from './TextInput';

// utilities
import { maxOutTimeOfDate, zeroOutTimeOfDate } from '../utils/DateUtils';

const DateSetterButton = ({ buttonText, clearDateRange, handleOnClick_setDateRange, quickDateSelected, setQuickDateSelection }) => {
   const isSelected = buttonText === quickDateSelected;
   const variants = {
      mount: {
         backgroundColor: 'rgba(255, 255, 255, 0)',
         borderRight: '1px solid transparent',
         borderBottom: '1px solid transparent',
         borderRadius: '0px',
         color: 'var(--bs-secondary)',
         opacity: 0.5
      },
      animate: {
         backgroundColor: isSelected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
         borderRadius: isSelected ? '10px' : '0px',
         borderRight: isSelected ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         borderBottom: isSelected ? '1px solid var(--mainPalette6)' : '1px solid transparent',
         color: isSelected ? 'var(--mainPalette2)' : 'var(--bs-secondary)',
         opacity: isSelected ? 1 : 0.5,
         transition: {
            borderRadius: {
               delay: 0.15
            }
         }
      },
      onHover: {
         backgroundColor: 'rgba(255, 255, 255, 0.5)',
         opacity: 1
      }
   };

   return (
      <motion.button
         animate='animate'
         className='bg-none border-top-0 border-start-0 w-100 px-2 py-1'
         initial='mount'
         onClick={() => {
            if (isSelected) return clearDateRange();

            handleOnClick_setDateRange();
            setQuickDateSelection(buttonText);
         }}
         variants={variants}
         whileHover='onHover'
      >
         {buttonText}
      </motion.button>
   );
};


// mongodb includes time when searching by date, so the starting date's time will be set to midnight, and the ending date's time will be set to the last millisecond of that date
const DateSettersContainer = ({ clearDateRange, hideFutureSelections, quickDateSelected, setDateRange, setQuickDateSelection }) => {

   // set to today's date, and depending on the options: leave as-is, set to yesterday, or tomorrow
   const adjustDateRange = ({ today, tomorrow }) => {
      const date = new Date();

      // if not today, adjust the date to tomorrow or yesterday
      if (!today) date.setDate(date.getDate() + (tomorrow ? 1 : -1));

      // return the date with time range of midnight to the last millisecond of the day
      return { dateStart: zeroOutTimeOfDate(date), dateEnd: maxOutTimeOfDate(new Date(date)) };
   };

   // set to this week (sunday - saturday), depending on the options: leave as-is, set to last week, or next week
   const adjustWeekRange = ({ thisWeek, nextWeek }) => {
      const date = new Date();

      // other than this week, fast-forward/back-track one week (7 days)
      if (!thisWeek) date.setDate(date.getDate() + (nextWeek ? 7 : -7));

      const dateStart = zeroOutTimeOfDate(date);
      const dateEnd = maxOutTimeOfDate(new Date(date));

      // set the start date to sunday (0) and set the end date to saturday (6)
      while (dateStart.getDay() !== 0) dateStart.setDate(dateStart.getDate() - 1);
      while (dateEnd.getDay() !== 6) dateEnd.setDate(dateEnd.getDate() + 1);

      return { dateStart, dateEnd };
   };

   // set to this month (first day - last day), depending on the options: leave as-is, set to last month, or next month
   const adjustMonthRange = ({ thisMonth, nextMonth }) => {
      const date = new Date();

      if (!thisMonth) date.setMonth(date.getMonth() + (nextMonth ? 1 : -1));

      const dateStart = zeroOutTimeOfDate(date);
      const dateEnd = maxOutTimeOfDate(new Date(date));

      while (dateStart.getDate() !== 1) dateStart.setDate(dateStart.getDate() - 1);

      // with months ending in different days, set ending date to the start of following month, then back-track one day
      while (dateEnd.getDate() !== 1) dateEnd.setDate(dateEnd.getDate() + 1);
      dateEnd.setDate(dateEnd.getDate() - 1);

      return { dateStart, dateEnd };
   };

   const setTodayRange = () => setDateRange(adjustDateRange({ today: true }));
   const setTomorrowRange = () => setDateRange(adjustDateRange({ tomorrow: true }));
   const setYesterdayRange = () => setDateRange(adjustDateRange({ yesterday: true }));

   const setThisWeekRange = () => setDateRange(adjustWeekRange({ thisWeek: true }));
   const setNextWeekRange = () => setDateRange(adjustWeekRange({ nextWeek: true }));
   const setLastWeekRange = () => setDateRange(adjustWeekRange({ lastWeek: true }));

   const setThisMonthRange = () => setDateRange(adjustMonthRange({ thisMonth: true }));
   const setNextMonthRange = () => setDateRange(adjustMonthRange({ nextMonth: true }));
   const setLastMonthRange = () => setDateRange(adjustMonthRange({ lastMonth: true }));

   return (
      <div className='container-fluid p-0'>
         <div className='row'>

            <div className='col-md d-flex flex-column gap-3'>
               <DateSetterButton
                  buttonText='Yesterday'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setYesterdayRange}
                  setQuickDateSelection={setQuickDateSelection}
               />
               <DateSetterButton
                  buttonText='Last Week'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setLastWeekRange}
                  setQuickDateSelection={setQuickDateSelection}
               />
               <DateSetterButton
                  buttonText='Last Month'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setLastMonthRange}
                  setQuickDateSelection={setQuickDateSelection}
               />
            </div>
            <div className='col-md d-flex flex-column gap-3'>
               <DateSetterButton
                  buttonText='Today'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setTodayRange}
                  setQuickDateSelection={setQuickDateSelection}
               />
               <DateSetterButton
                  buttonText='This Week'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setThisWeekRange}
                  setQuickDateSelection={setQuickDateSelection}
               />
               <DateSetterButton
                  buttonText='This Month'
                  clearDateRange={clearDateRange}
                  quickDateSelected={quickDateSelected}
                  handleOnClick_setDateRange={setThisMonthRange}
                  setQuickDateSelection={setQuickDateSelection}
               />

            </div>
            {/* this targetes the 'createdOn' dates. since you cannot have a created date of tomorrow and beyond */}
            {
               !hideFutureSelections &&
               <div className='col-md d-flex flex-column gap-3'>
                  <DateSetterButton
                     buttonText='Tomorrow'
                     clearDateRange={clearDateRange}
                     quickDateSelected={quickDateSelected}
                     handleOnClick_setDateRange={setTomorrowRange}
                     setQuickDateSelection={setQuickDateSelection}
                  />
                  <DateSetterButton
                     buttonText='Next Week'
                     clearDateRange={clearDateRange}
                     quickDateSelected={quickDateSelected}
                     handleOnClick_setDateRange={setNextWeekRange}
                     setQuickDateSelection={setQuickDateSelection}
                  />
                  <DateSetterButton
                     buttonText='Next Month'
                     clearDateRange={clearDateRange}
                     quickDateSelected={quickDateSelected}
                     handleOnClick_setDateRange={setNextMonthRange}
                     setQuickDateSelection={setQuickDateSelection}
                  />

               </div>
            }
         </div>
      </div>
   );
};

const FilterAndASort = ({
   clearFilters,
   filters,
   hideForm,
   setFilters,
   quickDateSelections,
   setQuickDateSelection
}) => (
   <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='500px' topMarginIsFixed={true} >
      <FormHeader text={'Filters'} />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Statuses' /></div>
      <FilterStatuses
         selectedStatusFilters={filters.status ?? []}
         setSelectedStatusFilters={statusIDs => setFilters({ ...filters, status: statusIDs })}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Customers' /></div>
      <FilterCustomers
         selectedCustomerFilters={filters.customer ?? []}
         setSelectedCustomerFilters={customerIDs => setFilters({ ...filters, customer: customerIDs })}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Drivers' /></div>
      <FilterDrivers
         selectedDriverFilters={filters.drivers ?? []}
         setSelectedDriverFilters={driverIDs => setFilters({ ...filters, drivers: driverIDs })}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Billing' /></div>
      <FilterFees
         selectedFeeFilters={filters.billing ?? []}
         setSelectedFeeFilters={feeIDs => setFilters({ ...filters, billing: feeIDs })}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Mileage' /></div>
      <div className='d-flex gap-3'>
         <TextInput
            input={filters.mileageGTE ?? ''}
            setInput={input => {
               // proceed if in put is a number
               if (!isNaN(input)) {
                  // update the value if the numbers are not same or it's ending in a decimal
                  if (input !== filters.mileageGTE) {
                     setFilters({
                        ...filters,
                        mileageGTE: input
                     })
                  };
               };
            }}
         />
         <TextInput
            input={filters.mileageLTE ?? ''}
            setInput={input => {
               // proceed if in put is a number
               if (!isNaN(input)) {
                  // update the value if the numbers are not same or it's ending in a decimal
                  if (input !== filters.mileageLTE) {
                     setFilters({
                        ...filters,
                        mileageLTE: input
                     })
                  };
               };
            }}
         />
      </div>

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Reference' /></div>
      <TextInput
         input={filters.reference ?? ''}
         setInput={input => {
            if (input !== filters.reference) {
               setFilters({ ...filters, reference: input });
            };
         }}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Notes' /></div>
      <TextInput
         input={filters.notes ?? ''}
         setInput={input => {
            if (input !== filters.notes) {
               setFilters({ ...filters, notes: input });
            };
         }}
      />

      <div className='text-secondary mt-2 mb-1'><SmallHeader text='Dates' /></div>
      <Tabs tabs={[
         {
            name: 'Pickup',
            icon: 'bi bi-box-arrow-in-up-right',
            contentJSX: (
               <DateSettersContainer
                  clearDateRange={() => {
                     const { pickupGTE, pickupLTE, ...otherFilters } = filters;

                     setQuickDateSelection({ pickup: null });
                     setFilters({ ...otherFilters, });
                  }}
                  quickDateSelected={quickDateSelections.pickup}
                  setDateRange={({ dateEnd, dateStart }) => {
                     const dates = {};

                     if (dateStart) dates.pickupGTE = dateStart;
                     if (dateEnd) dates.pickupLTE = dateEnd;

                     setFilters({ ...filters, ...dates });
                  }}
                  setQuickDateSelection={buttonText => setQuickDateSelection({ pickup: buttonText })}
               />
            )
         },
         {
            name: 'Delivery',
            icon: 'bi bi-box-arrow-down-right',
            contentJSX: (
               <DateSettersContainer
                  clearDateRange={() => {
                     const { deliveryGTE, deliveryLTE, ...otherFilters } = filters;

                     setQuickDateSelection({ delivery: null });
                     setFilters({ ...otherFilters, });
                  }}
                  quickDateSelected={quickDateSelections.delivery}
                  setDateRange={({ dateEnd, dateStart }) => {
                     const dates = {};

                     if (dateStart) dates.deliveryGTE = dateStart;
                     if (dateEnd) dates.deliveryLTE = dateEnd;

                     setFilters({ ...filters, ...dates });
                  }}
                  setQuickDateSelection={buttonText => setQuickDateSelection({ delivery: buttonText })}
               />
            )
         },
         {
            name: 'Created',
            icon: 'bi bi-calendar2-plus',
            contentJSX: (
               <DateSettersContainer
                  clearDateRange={() => {
                     const { createdOnGTE, createdOnLTE, ...otherFilters } = filters;

                     setQuickDateSelection({ created: null });
                     setFilters({ ...otherFilters, });
                  }}
                  hideFutureSelections={true}
                  quickDateSelected={quickDateSelections.created}
                  setDateRange={({ dateEnd, dateStart }) => {
                     const dates = {};

                     if (dateStart) dates.createdOnGTE = dateStart;
                     if (dateEnd) dates.createdOnLTE = dateEnd;

                     setFilters({ ...filters, ...dates });
                  }}
                  setQuickDateSelection={buttonText => setQuickDateSelection({ created: buttonText })}
               />
            )
         },
      ]} />

      {/* clears all the filters and selected date buttons */}
      <div className='mt-3'>
         <Button handleClick={clearFilters}>
            Clear All
         </Button>
      </div>
   </Modal>
);

export default FilterAndASort;