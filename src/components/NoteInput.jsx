// components
import FileInput from './FileInput';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';

// utilities
import { datePrettyString } from '../utils/StringUtils';

// used when needing to enter a note for a new job or edit a job
// once files have been uploaded, a table is displayed to show the new attachments
// only for a newly added note with no attachments does the file input appear
const NoteInput = ({
   attachments,
   createdAtDate,
   createdByName,
   deleteNote,
   isResizingImages,
   messageInput,
   noteIsNew,
   setIsResizingImagesFalse,
   setIsResizingImagesTrue,
   setMessageInput,
   setAttachments
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const hasAttachments = attachments.length > 0;

   const midOpacity = { opacity: 0.5 };

   return (
      <>
         <div className='container-fluid p-0 mt-3' style={{ borderTop: '1px dotted var(--mainPalette4)' }}>
            <div className='row mt-2'>
               <i
                  className='col-12 col-sm-1 order-sm-2 d-grid align-self-center fs-smaller text-secondary cursor-pointer text-end bi bi-trash3 py-1'
                  onClick={deleteNote}
                  role='button'
               >
               </i>
               <div className='col-12 col-sm-11 order-sm-1 fs-smaller text-secondary text-capitalize'>
                  {datePrettyString({ date: createdAtDate, includeTime: true })}
                  <br />
                  {createdByName}
               </div>
            </div>
         </div>

         <div className='my-2'>
            {
               hasAttachments &&
               <table className='table table-sm table-borderless text-reset m-0'>
                  <thead>
                     <tr className='text-secondary fs-smaller'>
                        <th className='fw-normal' colSpan='2' scope='col' style={midOpacity}>
                           {`Attachment${attachments.length > 1 ? 's' : ''}`}
                        </th>
                        <th className='fw-normal text-end' colSpan='2' scope='col' style={midOpacity}>Type</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        attachments.map((attachment, index) => {
                           const number = index + 1;
                           const hasNewFile = !!attachment.file;
                           let fileName = attachment.originalname?.split('.')[0];
                           let fileType = attachment.contentType?.split('/')[1].toLowerCase();

                           if (hasNewFile) {
                              const fileNameSplit = attachment.filename.split('.');

                              fileType = fileNameSplit.pop();
                              fileName = fileNameSplit.join('.');

                           };

                           return (
                              <tr key={attachment._id ?? index}>
                                 <th
                                    className='fs-smaller fw-normal text-secondary'
                                    scope='row'
                                    style={{ ...midOpacity, fontFamily: 'monospace' }}
                                 >
                                    {number.toString().padStart(2, '0')}
                                 </th>

                                 <td>
                                    {
                                       hasNewFile ?
                                          <>{fileName}</>
                                          :
                                          <a
                                             className='word-break-all text-reset text-decoration-none'
                                             href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
                                             rel='noopener noreferrer'
                                             target='_blank'
                                          >
                                             {fileName}
                                             <i className='bi bi-download text-secondary ms-2'></i>
                                          </a>
                                    }
                                 </td>

                                 <td className='text-nowrap text-end align-middle'>
                                    {fileType}
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </table>
            }

            {
               (!hasAttachments && noteIsNew) &&
               <FileInput
                  isResizingImages={isResizingImages}
                  setAttachments={setAttachments}
                  setIsResizingImagesFalse={setIsResizingImagesFalse}
                  setIsResizingImagesTrue={setIsResizingImagesTrue}
               />
            }
         </div>

         <span className='text-secondary' style={midOpacity}><SmallHeader text='Message' /></span>
         <GrowingTextArea
            input={messageInput}
            setInput={setMessageInput}
         />
      </>
   );
};

export default NoteInput;