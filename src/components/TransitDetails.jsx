const TransitDetails = ({ address, dateText, timeText }) => {
   const col1Classes = 'col-1 d-flex align-items-center justify-content-end fs-smaller text-secondary py-1 mb-auto';
   const col2Classes = 'col-11 text-capitalize ps-3';

   const timeStyles = { letterSpacing: '2px' };

   return (
      <div className='row g-0'>
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