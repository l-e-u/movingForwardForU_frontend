import CreatedInfo from './CreatedInfo';
import FileDownloadButton from './FileDownloadLink';

const NotesList = ({ list }) => {
    return (
        <ul className='list-group list-group-flush d-flex flex-column gap-2 mt-1'>
            {list.map((note) => {
                const { _id, attachments, createdAt, createdBy, subject, message } = note;
                const numOfAttachments = attachments.length;
                const hasAttachments = numOfAttachments > 0;

                return (
                    <li key={_id} className='list-group-item p-0 text-reset'>
                        <button
                            className='btn text-action rounded-0 border-0 w-100 text-start py-1 text-capitalize'
                            style={{ backgroundColor: 'var(--bs-gray-200)' }}
                            type='button'
                            data-bs-toggle='collapse'
                            data-bs-target={'#collapseMsg' + _id}
                            aria-expanded='false'
                            aria-controls={'collapseMsg' + _id}>
                            <span>{subject}</span>
                            {hasAttachments && <i className='bi bi-paperclip ms-2'></i>}
                        </button>
                        <div
                            className='collapse'
                            id={'collapseMsg' + _id}
                        >
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