import Counter from './Counter';
import CreatedInfo from './CreatedInfo';
import FileDownloadButton from './FileDownloadLink';

const NotesList = ({ list }) => {
   console.log(list)
   return (
      <ul className='list-group list-group-flush d-flex flex-column gap-2 mt-1'>
         {list.map((note) => {
            const { _id, attachments, createdAt, createdBy, message } = note;
            const numOfAttachments = attachments.length;
            const hasAttachments = numOfAttachments > 0;

            return (
               <li key={_id} className='note list-group-item p-0 text-reset'>
                  <button
                     className='btn text-action rounded border-0 text-start d-flex py-1 w-100'
                     style={{ backgroundColor: 'var(--bs-gray-100)' }}
                     type='button'
                     data-bs-toggle='collapse'
                     data-bs-target={'#collapseMsg' + _id}
                     aria-expanded='false'
                     aria-controls={'collapseMsg' + _id}>
                     {hasAttachments && <i className='bi bi-paperclip me-2 text-secondary d-inline'></i>}
                     {(numOfAttachments > 1) && <Counter number={numOfAttachments} />}
                     <span>{message}</span>
                  </button>

                  <div className='collapse' id={'collapseMsg' + _id}    >
                     <small className='mt-1 mb-2' style={{ whiteSpace: 'pre-wrap' }}>{message}</small>

                     {/* every download link gets listed separately */}
                     {hasAttachments && <div className='d-flex flex-wrap gap-4 justify-content-end mt-2'>
                        {attachments.map((attachment, index) => <FileDownloadButton {...attachment} key={_id + index} />)}
                     </div>}
                     <div className='text-end'> <CreatedInfo createdAt={createdAt} createdBy={createdBy} /></div>
                  </div>
               </li>
            )
         })}
      </ul>
   );
};

export default NotesList;