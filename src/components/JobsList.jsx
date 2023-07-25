// components
import ActionButton from './ActionButton';

// utilities
import { dateStringFormat, formatCurrency, timeStringFormat } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const JobsList = ({
   selectedJobID,
   setSelectedJobID,
   jobs = []
}) => {

   // creates all the rows needed for the data
   const rowsJSX = jobs.map((job, index) => {
      const { _id, status, customer, reference, pickup, delivery, notes, billing, mileage, parcel } = job;
      const pickupDate = new Date(pickup.date);
      const deliveryDate = new Date(delivery.date);

      const pickupDateString = pickupDate.toUTCString().substring(0, 17);
      const pickupTimeString = pickup.includeTime ? timeStringFormat(pickupDate, true) : '';

      const deliveryDateString = deliveryDate.toUTCString().substring(0, 17);
      const deliveryTimeString = delivery.includeTime ? timeStringFormat(deliveryDate, true) : '';

      const isSelected = _id === selectedJobID;

      // clicking on a row sets the selected job, clicking on the same row, nullifies the selected job
      return (
         <ul>

         </ul>
      )
   });
}

export default JobsList;