import Select from 'react-select';
import SmallHeader from './SmallHeader';

// accepts a date object and adjusts the time
const MilitaryTimeSelect = ({ date, isDisabled, setTime }) => {
   const dateCopy = new Date(date);
   const hours = dateCopy.getHours();
   const minutes = dateCopy.getMinutes();
   const hourOptions = [];
   const minuteOptions = [];
   const handleOnChange = ({ forHours }) => {
      return (selectedOption) => {
         const { value } = selectedOption;

         if (forHours) {
            dateCopy.setHours(value);
         }
         else {
            dateCopy.setMinutes(value);
         };

         setTime(dateCopy);
      };
   };

   // set everything else to zero
   dateCopy.setSeconds(0);
   dateCopy.setMilliseconds(0);

   // create the selectable options for the hours
   for (let hr = 0; hr < 24; hr++) {
      hourOptions.push({
         label: (hr * 100).toString().padStart(4, '0'),
         value: hr
      });
   };

   // create the selectable options for the minutes
   for (let min = 0; min < 60; min++) {
      minuteOptions.push({
         label: min.toString().padStart(2, '0'),
         value: min
      });
   };

   return (
      <div className='container-fluid p-0'>
         <div className='row'>
            <div className='col-6' >
               <span className='text-secondary' style={{ opacity: '0.5' }}>
                  <SmallHeader text='24Hr' />
               </span>
               <Select
                  classNamePrefix='mySelectInput'
                  closeMenuOnSelect={true}
                  isDisabled={isDisabled}
                  isSearchable
                  noOptionsMessage={() => 'Invalid.'}
                  onChange={handleOnChange({ forHours: true })}
                  options={hourOptions}
                  value={hourOptions[hours]}
               />
            </div>

            <div className='col-6'>
               <span className='text-secondary' style={{ opacity: '0.5' }}>
                  <SmallHeader text='Min' />
               </span>
               <Select
                  classNamePrefix='mySelectInput'
                  closeMenuOnSelect={true}
                  isDisabled={isDisabled}
                  isSearchable
                  noOptionsMessage={() => 'Invalid.'}
                  onChange={handleOnChange({ forMinutes: true })}
                  options={minuteOptions}
                  value={minuteOptions[minutes]}
               />
            </div>
         </div>
      </div>
   )
};

export default MilitaryTimeSelect;