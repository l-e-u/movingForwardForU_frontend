export const maxOutTimeOfDate = (date) => {
   const dateCopy = new Date(date);

   // max out the time portion of the date, keeping the local timezone
   dateCopy.setMilliseconds(999);
   dateCopy.setSeconds(59);
   dateCopy.setMinutes(59);
   dateCopy.setHours(23);

   return dateCopy;
};

export const zeroOutTimeOfDate = (date) => {
   const dateCopy = new Date(date);

   // zero out the time portion of the date, keeping the local timezone
   dateCopy.setMilliseconds(0);
   dateCopy.setSeconds(0);
   dateCopy.setMinutes(0);
   dateCopy.setHours(0);

   return dateCopy;
};