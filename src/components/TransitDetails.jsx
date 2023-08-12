import SmallHeader from './SmallHeader';

const TransitDetails = ({ address, dateText, heading, timeText }) => {
   const col1Classes = 'col-1 d-flex align-items-center justify-content-start fs-smaller text-secondary py-1 mb-auto';
   const col2Classes = 'col-11 text-capitalize';

   const timeStyles = { letterSpacing: '2px' };

   return (
      <div className='row g-0'>
         <div className='text-secondary' style={{ opacity: '0.5' }}>
            <SmallHeader text={heading} />
         </div>

         <i className={`bi bi-clock ${col1Classes}`}></i>
         <span className={col2Classes} style={timeStyles}>{timeText}</span>

         <i className={`bi bi-calendar4-event ${col1Classes}`}></i>
         <span className={col2Classes}>{dateText}</span>

         <i className={`bi bi-geo-alt ${col1Classes}`}></i>
         <span className={col2Classes}>{address}</span>
      </div>
   );
};

export default TransitDetails;