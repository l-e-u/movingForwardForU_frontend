import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useMyJobsContext } from '../hooks/useMyJobsContext';
import { useUpdateJob } from '../hooks/useUpdateJob';

// components
import ActionButton from './ActionButton';
import FileUploadHandler from './FileUploadHandler';
import GrowingTextArea from './GrowingTextArea';
import XButton from './XButton';

// displays a button to append a single note, after appending, it shows a note template to fill out and a save button.
const DriverNoteInput = ({ job_id }) => {
   const { user } = useAuthContext();
   const { dispatch } = useMyJobsContext();
   const { updateJob, error, isLoading } = useUpdateJob();

   const [note, setNote] = useState(null);
   const [isResizingImages, setIsResizingImages] = useState(false);

   const maxUploadSize = 5 * 1024 * 1024; // 5MB
   const uploadSize = note?.attachments.reduce((total, { file }) => total + file.size, 0) || 0;
   const underMaxUploadSize = uploadSize <= maxUploadSize;
   const noteHasContent = (note?.subject && (note?.message || note?.attachments.length > 0) && underMaxUploadSize);

   let buttonText = (note ? 'Save' : 'Add') + ' Note';
   if (isLoading) buttonText = ' Saving...';

   return (
      <form
         onSubmit={async (e) => {
            e.preventDefault();

            // a note needs to have a subject AND, something in the message or at least one attachment, AND under the upload size limit
            if (noteHasContent) {
               await updateJob({
                  _id: job_id,
                  updates: { notes: [note], driverNote: true }
               })
                  .then(updatedJob => {
                     if (updatedJob) {
                        // clear the local state
                        setNote(null);
                        dispatch({ type: 'UPDATE_MYJOB', payload: updatedJob });
                     }
                  })
            }
         }}
      >
         {note &&
            <CSSTransition
               appear={true}
               classNames='fade-'
               in={true}
               timeout={500}
            >
               <>
                  <div
                     className='position-relative border rounded mb-2'
                     style={{ backgroundColor: 'var(--bs-gray-100' }}
                  >
                     <div className='position-absolute top-0 end-0 text-action'>
                        <XButton handleOnClick={() => setNote(null)} />
                     </div>
                     <input
                        className='form-control-plaintext background-white text-reset py-1 px-2'
                        onBlur={e => setNote(prev => ({ ...prev, subject: e.target.value.trim() }))}
                        onChange={e => setNote(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder='Subject'
                        value={note?.subject ?? ''}
                     />
                     <GrowingTextArea
                        className='form-control-plaintext smallPrint text-reset px-2'
                        onBlur={e => setNote(prev => ({ ...prev, message: e.target.value.trim() }))}
                        onChange={e => setNote(prev => ({ ...prev, message: e.target.value }))}
                        placeholder='Type message...'
                        value={note?.message ?? ''}
                     />
                     <div className='px-2 pb-2'>
                        <FileUploadHandler
                           files={note?.attachments || []}
                           isResizingImages={isResizingImages}
                           setIsResizingImages={setIsResizingImages}
                           setFiles={({ images }) => setNote(prev => ({ ...prev, attachments: images }))}
                        />
                     </div>
                  </div>
                  {!underMaxUploadSize &&
                     <div className='text-reset mb-2'>
                        Upload size limit exceeded. You need to remove some new attachments.
                     </div>
                  }
                  {error &&
                     <div className='text-reset mb-2'>
                        An error has occurred, refresh and try again.
                     </div>
                  }
               </>
            </CSSTransition>
         }

         <ActionButton
            alignX='right'
            handleOnClick={() => {
               if (!note) setNote({ attachments: [], createdBy: user._id, message: '', subject: '' });
            }}
            isDisabled={!underMaxUploadSize || isResizingImages}
            isLoading={isLoading || isResizingImages}
            text={isResizingImages ? '' : buttonText}
            type='submit'
         />
      </form>
   );
};

export default DriverNoteInput;