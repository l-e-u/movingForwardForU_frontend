import { useState } from 'react';

// components
import ErrorAlert from './ErrorAlert';
import FileInput from './FileInput';
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import Modal from './Modal';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useUpdateJob } from '../hooks/useUpdateJob';

// utilities
import { datePrettyString } from '../utils/StringUtils';

function FormAddNote({ hideForm, jobID }) {
   const { user } = useAuthContext();
   const { updateJob, error, isLoading } = useUpdateJob();

   const [note, setNote] = useState({
      attachments: [],
      createdAt: new Date(),
      createdBy: user,
      message: ''
   });
   const [isResizingImages, setIsResizingImages] = useState(false);

   const { attachments, createdAt, createdBy, message } = note;

   const submitButtonText = isLoading ? 'Adding' : 'Add';

   const setIsResizingImagesFalse = () => setIsResizingImages(false);
   const setIsResizingImagesTrue = () => setIsResizingImages(true);
   const handleSubmit = async (e) => {
      e.preventDefault();

      const noteAdded = await updateJob({
         _id: jobID,
         updates: {
            driverNote: true,
            notes: [note]
         }
      });

      if (noteAdded) hideForm();
   };

   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='400px'>
         <form onSubmit={handleSubmit}>

            <FormHeader text='Add a Note' />
            <div className='text-secondary text-capitalize mt-1'>
               <SmallHeader text={datePrettyString({ date: createdAt, includeTime: true })} />
            </div>
            <div className='text-secondary mb-3'><SmallHeader text={createdBy.fullName} /></div>

            <FileInput
               isResizingImages={isResizingImages}
               setAttachments={attachments => setNote({ ...note, attachments })}
               setIsResizingImagesFalse={setIsResizingImagesFalse}
               setIsResizingImagesTrue={setIsResizingImagesTrue}
            />

            <div className='text-secondary mt-3'><SmallHeader text='Message' /></div>
            <GrowingTextArea
               input={message}
               setInput={message => setNote({ ...note, message })}
            />

            {
               error &&
               <div className='mt-3'>
                  <ErrorAlert message={error.message} />
               </div>
            }

            <div className='d-flex justify-content-end mt-3'>
               <SubmitButton
                  buttonType='submit'
                  buttonText={submitButtonText}
                  isSubmittingForm={isLoading}
                  isDisabled={isLoading}
               />
            </div>
         </form>
      </Modal>
   );
};

export default FormAddNote;