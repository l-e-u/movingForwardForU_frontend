// components
import ActionButton from './ActionButton';

// utilities
import { dateStringFormat, formatCurrency, timeStringFormat } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const JobsList = ({
   selectedJob,
   setSelectedJob,
   jobs = []
}) => {

   // styling for the list
   const listClasses = 'm-0';
   const listStyles = {
      listStyle: 'none',
      paddingInlineStart: '0px'
   };

   // styling for each item
   const itemClasses = `border`;
   const itemStyles = { cursor: 'pointer' };

   // creates all the rows needed for the data
   const itemsJSX = jobs.map((job, index) => {
      const { _id, status, customer, reference, pickup, delivery, notes, billing, mileage, parcel } = job;
      const pickupDate = new Date(pickup.date);
      const deliveryDate = new Date(delivery.date);

      const pickupDateString = dateStringFormat(pickupDate).toUpperCase();
      const pickupTimeString = pickup.includeTime ? timeStringFormat(pickupDate, true) : '';

      const deliveryDateString = dateStringFormat(deliveryDate).toUpperCase();
      const deliveryTimeString = delivery.includeTime ? timeStringFormat(deliveryDate, true) : '';

      const isSelected = _id === selectedJob?._id;

      // clicking on an item sets the job which populates JobDetails component. clicking on an item that is selected will deselect it by setting to null
      const handleOnClickItem = () => {
         if (isSelected) return setSelectedJob(null);

         setSelectedJob(job);
      };

      // clicking on a row sets the selected job, clicking on the same row, nullifies the selected job
      return (
         <li key={_id} className={itemClasses} style={itemStyles} onClick={handleOnClickItem}>
            <span className='me-3'>{status.name}</span>
            <span>{reference}</span>
            <div>{customer.organization}</div>
            <div>{reference}</div>
            <div>{pickupTimeString}</div>
            <div>{pickupDateString}</div>
         </li>
      );
   });

   return (
      <ul className={listClasses} style={listStyles}>
         {itemsJSX}
      </ul>
   );
};

export default JobsList;