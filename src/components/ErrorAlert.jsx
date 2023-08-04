const ErrorAlert = ({ message }) => (
   <div className='alert alert-danger py-1 px-2' role='alert'>
      <i className='bi bi-exclamation-triangle me-2'></i>
      {message}
   </div>
);

export default ErrorAlert;