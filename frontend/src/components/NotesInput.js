import { useAuthContext } from '../hooks/useAuthContext';

// components
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import XButton from './XButton';

// user can create a list of notes, each note has its own functions to update and delete itself
const NotesInput = ({
    error,
    notes,
    setError,
    setJob,
}) => {
    const { user } = useAuthContext();
    const userId = user._id;
    const hasNotes = notes.length > 0;

    const handleOnChange = (input, index) => {
        const updatedNotes = [...notes];

        updatedNotes[index] = {
            ...updatedNotes[index],
            ...input,
            createdAt: new Date()
        };

        setJob(prev => {
            return {
                ...prev,
                notes: updatedNotes
            }
        });
    };

    const handleDeleteOnClick = (index) => {
        // when a note with an error is deleted, also delete the error if it has it
        [setError, setJob].forEach(stateSetter => {
            stateSetter(prev => {
                if (!prev?.notes) return prev;

                return {
                    ...prev,
                    notes: prev.notes.filter((note, i) => i !== index)
                }
            });
        });
    };

    return (
        <>
            {hasNotes &&
                <div>
                    <SmallHeader text='NOTES' />
                    <ul className='list-group mt-1 d-flex flex-column gap-1'>
                        {notes.map((note, index) => {
                            const noteId = note._id;
                            const inputSubjectError = error?.notes[index]?.subject;
                            const inputMessageError = error?.notes[index]?.message;
                            const inputError = inputMessageError || inputSubjectError;

                            return (
                                <li key={noteId || index} className={'position-relative form-control' + (inputError ? ' is-invalid' : '')}>
                                    <div className='position-absolute top-0 end-0'>
                                        <XButton handleOnClick={() => handleDeleteOnClick(index)} />
                                    </div>
                                    <input
                                        className='form-control-plaintext p-0'
                                        placeholder={'Subject' + (inputSubjectError ? ` : ${inputSubjectError}` : '')}
                                        value={note.subject}
                                        onBlur={e => handleOnChange({ subject: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ subject: e.target.value }, index)} />
                                    <GrowingTextArea
                                        value={note.message}
                                        className='form-control-plaintext p-0'
                                        placeholder={'Message' + (inputMessageError ? ` : ${inputMessageError}` : '')}
                                        onBlur={e => handleOnChange({ message: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ message: e.target.value }, index)} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            }
            <button
                type='button'
                className='btn rounded-circle border-0 btn-lg btn-outline-primary d-flex mx-auto'
                onClick={() => {
                    setJob(prev => {
                        return {
                            ...prev,
                            notes: [...prev.notes, { subject: '', message: '', createdBy: userId }]
                        }
                    })
                }}>
                <i className='bi bi-journal-plus'></i>
            </button>
        </>
    );
};

export default NotesInput;