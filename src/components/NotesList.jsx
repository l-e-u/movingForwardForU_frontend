import Counter from './Counter';
import CreatedInfo from './CreatedInfo';
import FileDownloadButton from './FileDownloadLink';

const NotesList = ({ list }) => {

   const listStyles = {
      listStyle: 'none',
      paddingInlineStart: '0px'
   };

   const paragraphStyles = {
      whiteSpace: 'pre-wrap',
   };

   const noteJSX = list.map((note, index) => {
      const { _id } = note;
      const lastNote = index === list.length - 1;

      return (
         <li key={note._id}>
            <p className='m-0 fs-smaller' style={paragraphStyles}>
               {note.message + `kfjaoienfoaneiofa fkeagoanl a ioahgeoaeofj ijeoajfoaijef aijoeaifjioa joijeagfiojaoijkljdlafjlkdalfka kjldakf;j NEW LINE \n lkjdlkfajkd kdlfjadfklajdlfjalkdjfkl ajkldjf klajkdflj aklf   eoihgworighurghuieh ogrh a rba94h v949ha7g4b9 c  agc 94 joaigeja geeagio jogr`}
            </p>
            {!lastNote && <hr />}
         </li>
      );
   });

   return (
      <ul className='m-0' style={listStyles}>
         {noteJSX}
      </ul>
   )
   return (
      <ul className=''>
         {list.map((note) => {
            const { _id, attachments, createdAt, createdBy, message } = note;
            const numOfAttachments = attachments.length;
            const hasAttachments = numOfAttachments > 0;

            return (
               <li key={_id} className=''>
                  <button
                     className='border-0'
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