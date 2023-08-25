// components
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import Modal from './Modal';
import SubmitButton from './SubmitButton';

// hooks
import { useDeleteDocument } from '../hooks/useDeleteDocument';

const DeleteForm = ({
   apiRouteName,
   deleteFromContext,
   documentID,
   hideForm,
   modelName,
   warning
}) => {
   const { deleteDocument, error, isLoading } = useDeleteDocument({
      apiRouteName,
      deleteFromContext,
      documentID
   });
   const submitButtonText = isLoading ? 'Deleting' : 'Delete';
   const documentInUse = error?.value.includes('Job');
   const errorMessage = documentInUse ? error.message : 'Oops, something went wrong. Please try again.';

   const handleSubmit = async (e) => {
      e.preventDefault();

      const wasDeleted = await deleteDocument();

      if (wasDeleted) hideForm();
   };

   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='400px'>
         {
            error &&
            <>
               <FormHeader text='Error' />
               {/* when trying to delete a contact, status, or fee, an error will be returned if that document is being used in any job */}
               {
                  documentInUse &&
                  <p className='fs-smaller text-secondary whiteSpace-preWrap mt-3'>
                     {`This ${modelName} is referenced on a job.\nBefore this ${modelName} can be deleted, please unassign it from the job. \n\nAlternatively, the job can be deleted or achived.`}
                  </p>
               }
               <ErrorAlert message={errorMessage} />
            </>
         }

         {
            !error &&
            <form className='deleteForm' onSubmit={handleSubmit}>
               <FormHeader text='Confirm' />

               <p className='fs-smaller text-secondary mt-1'>This cannot be undone. Are you sure you want to delete?</p>

               {warning && <p className='fs-smaller text-secondary'>{warning}</p>}

               <div className='d-flex justify-content-end'>
                  <SubmitButton
                     buttonText={submitButtonText}
                     buttonType='submit'
                     isDisabled={isLoading}
                     isSubmittingForm={isLoading}
                  />
               </div>
            </form>
         }
      </Modal>
   )
}

export default DeleteForm;