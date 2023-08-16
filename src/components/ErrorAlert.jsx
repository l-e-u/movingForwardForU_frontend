const ErrorAlert = ({ message }) => (
   <div className='alert fs-smaller alert-danger border-danger border-top-0 border-start-0 py-1 px-2 m-0' role='alert'>
      <i className='bi bi-exclamation-triangle me-2'></i>
      {message}
   </div>
);

export default ErrorAlert;