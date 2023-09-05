// components
import SmallHeader from './SmallHeader';

// utilities
import { datePrettyString } from '../utils/StringUtils';

// shows parcel and mileage by default, the rest is shown when passed
const JobDetails = ({ createdAt, createdBy, drivers, mileage, parcel }) => (
   <div className='container-fluid p-0'>
      {/* PARCEL */}
      <div className='row mb-1'>
         <div className='col-sm-2 text-sm-end text-secondary'>
            <SmallHeader text='Parcel' />
         </div>
         <div className='col-sm-10'>
            {parcel}
         </div>
      </div>

      {/* MILEAGE */}
      <div className='row mb-1'>
         <div className='col-sm-2 text-sm-end text-secondary'>
            <SmallHeader text='Mileage' />
         </div>
         <div className='col-sm-10'>
            {mileage}
         </div>
      </div>

      {
         drivers &&
         <div className='row mb-1'>
            <div className='col-sm-2 text-sm-end text-secondary'>
               <SmallHeader text={`Driver${drivers.length > 1 ? 's' : ''}`} />
            </div>
            <div className='col-sm-10'>
               {(drivers.length === 0) && <div>None assigned</div>}
               {
                  drivers.map((driver, index) => (
                     <div key={driver._id || index}>{driver.fullName}</div>
                  ))
               }
            </div>
         </div>
      }

      {
         createdBy &&
         <div className='row mb-1'>
            <div className='col-sm-2 text-sm-end text-secondary'>
               <SmallHeader text='Creator' />
            </div>
            <div className='col-sm-10'>
               {createdBy.fullName}
            </div>
         </div>
      }

      {
         createdAt &&
         <div className='row'>
            <div className='col-sm-2 text-sm-end text-secondary'>
               <SmallHeader text='Created' />
            </div>
            <div className='col-sm-10 text-capitalize'>
               {datePrettyString({ date: createdAt, includeTime: true })}
            </div>
         </div>
      }
   </div>
);

export default JobDetails;