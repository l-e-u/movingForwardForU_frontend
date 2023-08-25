// components
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import Modal from './Modal';
import SubmitButton from './SubmitButton';

// hooks
import { useUpdateJob } from '../hooks/useUpdateJob';

const FormArchive = ({ hideForm, jobID }) => {
   const { updateJob, error, isLoading } = useUpdateJob();

   const submitButtonText = isLoading ? 'Archiving' : 'Archive';
   const handleSubmit = async (e) => {
      e.preventDefault();

      const updatedJobForm = new FormData();
      const updatedFields = { isArchived: true, archivedOn: new Date() };
      const filesToDelete = [];

      updatedJobForm.append('filesToDelete', JSON.stringify(filesToDelete));
      updatedJobForm.append('updates', JSON.stringify(updatedFields));

      const jobUpdated = await updateJob({ _id: jobID, updatedJobForm });

      if (jobUpdated) hideForm();
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