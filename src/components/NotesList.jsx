// components
import FileDownloadButton from './FileDownloadLink';

// utilities
import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

const NotesList = ({ list }) => {
   const listStyles = {
      listStyle: 'none',
      paddingInlineStart: '0px'
   };

   const paragraphStyles = {
      whiteSpace: 'pre-wrap',
   };

   const itemsJSX = list.map((note, index) => {
      const { _id, attachments, createdBy, createdAt } = note;
      const createdOnDate = new Date(createdAt);
      const lastNote = index === list.length - 1;

      return (
         <li key={_id}>
            <div className='position-relative fs-smaller text-secondary mb-1'>
               <div>{createdBy.fullName}</div>
               <div>{`${dateStringFormat(createdOnDate)} · ${timeStringFormat(createdOnDate, true)}`}</div>
               <span className='position-absolute top-0 end-0'>{`# ${index + 1}`}</span>
            </div>

            <p className='m-0' style={paragraphStyles}>
               {note.message + `kfjaoienfoaneiofa fkeagoanl a ioahgeoaeofj ijeoajfoaijef aijoeaifjioa joijeagfiojaoijkljdlafjlkdalfka kjldakf;j NEW LINE \n lkjdlkfajkd kdlfjadfklajdlfjalkdjfkl ajkldjf klajkdflj aklf   eoihgworighurghuieh ogrh a rba94h v949ha7g4b9 c  agc 94 joaigeja geeagio jogr`}
            </p>
            {attachments.map((attachment, index) => {
               return (
                  <div key={attachment._id} className='d-flex justify-content-end mt-2'>
                     <span className='text-secondary fs-smaller me-1'>{`${index + 1}. `}</span>
                     <FileDownloadButton key={attachment._id} {...attachment} />
                  </div>
               )
            })}
            {!lastNote && <hr />}
         </li>
      );
   });

   return (
      <ul className='m-0' style={listStyles}>
         {itemsJSX}
      </ul>
   );
};

export default NotesList;