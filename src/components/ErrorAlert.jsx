const ErrorAlert = ({ message }) => {
   const errorClasses = 'alert alert-danger py-1 px-2';
   const errorIconClasses = 'bi bi-exclamation-lg';

   return (
      <div className={errorClasses} role='alert'>
         <i className={errorIconClasses}></i>
         {message}
      </div>
   )
};

export default ErrorAlert;