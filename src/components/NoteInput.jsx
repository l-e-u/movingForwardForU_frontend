// components
import FileInput from './FileInput';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';

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
   return (
      <div>
         <FileInput
            isResizingImages={isResizingImages}
            setAttachments={setAttachments}
            setIsResizingImagesFalse={setIsResizingImagesFalse}
            setIsResizingImagesTrue={setIsResizingImagesTrue}
         />
         <div className='container-fluid my-1'>
            <div className='row'>

               <div className='col-sm-5'>
                  <div className='text-secondary'><SmallHeader text='Creator' /></div>
                  {createdByName}
               </div>

               <div className='col-sm-7'>
                  <div className='text-secondary'><SmallHeader text='Created' /></div>
                  <span className='text-capitalize'>
                     {datePrettyString({ dateObject: createdAtDate, includeTime: true })}
                  </span>
               </div>
            </div>
         </div>
         <GrowingTextArea
            input={messageInput}
            setInput={setMessageInput}
         />
      </div>
   );
};

export default NoteInput;