// components
import SmallHeader from './SmallHeader';

const NotesList = ({ notes }) => {
    return (
        <div>
            <SmallHeader text='NOTES' />
            <ul className='list-group list-group-flush d-flex flex-column gap-2 mt-1'>
                {notes.map((note, index) => {
                    const { _id, subject, message } = note;
                    return (
                        <li key={_id} className='list-group-item p-0 text-reset'>
                            <button
                                className='btn btn-secondary rounded-0 border-0 w-100 text-start py-1 text-capitalize'
                                type='button'
                                data-bs-toggle='collapse'
                                data-bs-target={'#collapseMsg' + _id}
                                aria-expanded='false'
                                aria-controls={'collapseMsg' + _id}>
                                {subject}
                            </button>
                            <div
                                className='collapse mt-1 '
                                id={'collapseMsg' + _id}
                                style={{ whiteSpace: 'pre-wrap' }} >
                                {message}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default NotesList;