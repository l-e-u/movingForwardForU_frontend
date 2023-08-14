// components
import FileInput from './FileInput';
import GrowingTextArea from './GrowingTextArea';

// utilities
import { datePrettyString } from '../utils/StringUtils';

const NoteInput = ({
   attachments,
   createdAtDate,
   createdByName,
   isResizingImages,
   messageInput,
   setIsResizingImagesFalse,
   setIsResizingImagesTrue,
   setMessageInput,
   setAttachments
}) => {
   const dateObject = new Date(createdAtDate);

   return (
      <>
         <div className='container-fluid p-0 mb-2'>
            <div className='row'>
               <div className='col-12 fs-smaller text-secondary text-capitalize' style={{ opacity: 0.5 }}>
                  {datePrettyString({ dateObject, includeTime: true })}
               </div>

               <div className='col-12 fs-smaller text-secondary' style={{ opacity: 0.5 }}>
                  {createdByName}
               </div>
            </div>
         </div>

         <div className='mb-2'>
            <FileInput
               isResizingImages={isResizingImages}
               setAttachments={setAttachments}
               setIsResizingImagesFalse={setIsResizingImagesFalse}
               setIsResizingImagesTrue={setIsResizingImagesTrue}
            />
         </div>

         <GrowingTextArea
            input={messageInput}
            setInput={setMessageInput}
         />
      </>
   );
};

export default NoteInput;