// functions
import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

const AddressDisplay = ({
   address,
   date,
   includeTime,
}) => {
   // styling for icons
   const iconStyles = { color: 'var(--mainPalette4)' };

   const today = new Date();
   const scheduledDate = new Date(date);
   // const militaryTimeString = includeTime ? timeStringFormat(scheduledDate, true) : null;
   const timeString = includeTime ? timeStringFormat(scheduledDate, false) : '-- : --';
   let dateString = dateStringFormat(scheduledDate).toUpperCase();

   if (
      (today.getFullYear() === scheduledDate.getFullYear()) &&
      (today.getMonth() === scheduledDate.getMonth()) &&
      (today.getDate() === scheduledDate.getDate())
   ) {
      dateString = 'Today';
   }

   return (
      <div className='dateTimeAddressDetails'>
         {/* date */}
         <div className='d-flex gap-2'>
            <i className='bi bi-calendar-event' style={iconStyles}></i>
            <span>{dateString}</span>
         </div>

         {/* time */}
         <div className='d-flex gap-2'>
            <i className='bi bi-clock' style={iconStyles}></i>
            <span>{timeString}</span>
         </div>

         {/* address */}
         <div className='d-flex gap-2'>
            <i className='bi bi-geo-alt' style={iconStyles}></i>
            <span>{address}</span>
         </div>
      </div>
   );
};

export default AddressDisplay;