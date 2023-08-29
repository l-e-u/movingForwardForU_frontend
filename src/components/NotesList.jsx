// components
import AttachmentDownloadLink from './AttachmentDownloadLink';
import SmallHeader from './SmallHeader';

// utilities
import { datePrettyString } from '../utils/StringUtils';

const NotesList = ({ notes }) => (
   <ul className='notesList list-style-none container-fluid p-0 m-0'>
      {
         notes.map(note => (
            <li
               key={note._id}
               className='row d-flex justify-content-between mt-3'
               style={{
                  borderTop: '1px dotted rgba(var(--bs-secondary-rgb), 0.25)',
               }}
            >
               <div className='col-12 fs-smaller text-secondary text-capitalize mt-2'>
                  {datePrettyString({ date: note.createdAt, includeTime: true })}
               </div>

               <div className='col-12 fs-smaller text-secondary mb-2'>
                  {note.createdBy.fullName}
               </div>

               {
                  (note.attachments.length > 0) &&
                  <div className='px-2 mb-2'>
                     <table className='table table-sm table-borderless text-reset m-0'>
                        <thead>
                           <tr className='text-secondary fs-smaller'>
                              <th className='fw-normal opacity-50' scope='col' colSpan='2'>
                                 {`Attachment${note.attachments.length > 1 ? 's' : ''}`}
                              </th>
                              <th className='fw-normal opacity-50 text-end' colSpan='2' scope='col'>Type</th>
                           </tr>
                        </thead>
                        <tbody>
                           {
                              note.attachments.map((attachment, index) => {
                                 const number = index + 1;
                                 const hasNewFile = !!attachment.file;
                                 let fileType = attachment.contentType?.split('/')[1].toLowerCase();

                                 if (hasNewFile) fileType = attachment.filename.split('.')[1];

                                 return (
                                    <tr key={attachment._id ?? index}>
                                       <th
                                          className='fs-smaller opacity-50 fw-normal text-secondary'
                                          scope='row'
                                          style={{ fontFamily: 'monospace' }}
                                       >
                                          {number.toString().padStart(2, '0')}
                                       </th>

                                       <td>
                                          <AttachmentDownloadLink attachment={attachment} />
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
                  </div>
               }

               <span className='text-secondary opacity-50' ><SmallHeader text='Message' /></span>
               <div className='col-12 whiteSpace-preWrap'>
                  {note.message}
               </div>
            </li>
         ))
      }
   </ul>
);

export default NotesList;