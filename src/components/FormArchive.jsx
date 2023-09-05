// components
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import Modal from './Modal';
import SubmitButton from './SubmitButton';

// hooks
import { useArchiveJob } from '../hooks/useArchiveJob';

const FormArchive = ({ hideForm, jobID }) => {
   const { archiveJob, error, isLoading } = useArchiveJob();

   const submitButtonText = isLoading ? 'Archiving' : 'Archive';
   const handleSubmit = async (e) => {
      e.preventDefault();

      const jobArchived = await archiveJob({ _id: jobID });

      if (jobArchived) hideForm();
   };

   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='400px'>
         <form className='archiveForm' onSubmit={handleSubmit}>
            <FormHeader text='Archive Job?' />

            <p className='fs-smaller whiteSpace-preWrap text-secondary mt-1 mb-3'>
               {`This cannot be undone.\n\nOnce a job is achived, its details become read-only and only notes can be added. It can no longer be found in Jobs or Dispatch, it can be accessed in the Archives only.`}
            </p>

            <div className='d-flex justify-content-end'>
               <SubmitButton
                  buttonText={submitButtonText}
                  buttonType='submit'
                  isDisabled={isLoading}
                  isSubmittingForm={isLoading}
               />
            </div>
         </form>

         {
            error &&
            <div className='mb-3'>
               <ErrorAlert message={error.message} />
            </div>
         }
      </Modal>
   );
};

export default FormArchive;