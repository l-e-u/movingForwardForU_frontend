// components
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import Modal from './Modal';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';

const StatusForm = ({
   name,
   description,
   setStatus,
   handleSubmit,
   error,
   heading,
   hideForm,
   isFetching,
   subHeading,
   submitButtonText,
   submitButtonIsDisabled,
}) => {
   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='500px'>
         <form onSubmit={handleSubmit}>

            <FormHeader text={heading} />
            <p className='text-secondary whiteSpace-preWrap fs-smaller mt-1 mb-3'>{subHeading}</p>

            <div className='container-fluid p-0'>
               {/* NAME */}
               <div className='row mb-3'>
                  <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                     <SmallHeader text='Name' />
                  </div>
                  <div className='col-sm-9'>
                     <TextInput input={name} setInput={input => setStatus(prev => ({ ...prev, name: input }))} />
                  </div>
               </div>

               {/* DESCRIPTION */}
               <div className='row mb-3'>
                  <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                     <SmallHeader text='Description' />
                  </div>
                  <div className='col-sm-9'>
                     <GrowingTextArea input={description} setInput={input => setStatus(prev => ({ ...prev, description: input }))} />
                  </div>
               </div>
            </div>

            {error && <ErrorAlert message={error.message} />}

            <div className='d-flex justify-content-end'>
               <SubmitButton
                  buttonText={submitButtonText}
                  buttonType='submit'
                  isDisabled={submitButtonIsDisabled}
                  isSubmittingForm={isFetching}
               />
            </div>
         </form >
      </Modal>
   );
};

export default StatusForm;