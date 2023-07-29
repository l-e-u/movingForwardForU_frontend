// components
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';

const StatusForm = ({
   name,
   description,
   setStatus,
   handleSubmit,
   error,
   isDisabled,
   isLoading
}) => {
   // styles for the form
   const formClasses = 'newStatusForm position-relative p-4 pb-5 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '500px' };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles}>

         <FormHeader text='New Status' />
         <p className='text-secondary fs-smaller mb-4'>A status categorizes the state of a job.</p>

         <div className='container-fluid p-0'>

            {/* NAME */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Name' />
               </div>
               <div className='col-sm-9'>
                  <TextInput input={name} setInput={input => setStatus(prev => ({ ...prev, name: input }))} />
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Description' />
               </div>
               <div className='col-sm-9'>
                  <GrowingTextArea input={description} setInput={input => setStatus(prev => ({ ...prev, description: input }))} />
               </div>
            </div>
         </div>

         {error && <ErrorAlert message={error.message} />}

         <SubmitButton
            defaultText='Save'
            loadingText='Saving'
            isDisabled={isLoading}
            isLoading={isLoading}
         />
      </form >
   );
};

export default StatusForm;