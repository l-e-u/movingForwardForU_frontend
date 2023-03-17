// components
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import XButton from './XButton';
import ActionButton from './ActionButton';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

// user can create a list of notes, each note has its own functions to update and delete itself
const NotesInput = ({
    error,
    notes,
    setError,
    setJob,
}) => {
    const { user } = useAuthContext();
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
        <div className='d-flex flex-column gap-2'>
            <SmallHeader text='NOTES' />
            {hasNotes &&
                <ul className='list-group mb-1 d-flex flex-column gap-1 overflow-scroll' style={{ maxHeight: '415px' }}>
                    {notes.map((note, index) => {
                        const noteId = note._id;
                        const inputSubjectError = error?.notes[index]?.subject;
                        const inputMessageError = error?.notes[index]?.message;
                        const inputError = inputMessageError || inputSubjectError;

                        return (
                            <li key={noteId || index} className={'position-relative form-control' + (inputError ? ' is-invalid' : '')}>
                                <div className='position-absolute top-0 end-0 text-action'>
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
                                    onChange={e => handleOnChange({ message: e.target.value }, index)}
                                />
                            </li>
                        );
                    })}
                </ul>
            }
            <ActionButton
                isDisabled={error}
                handleOnClick={() => {
                    setJob(prev => {
                        return {
                            ...prev,
                            notes: [...prev.notes, { subject: '', message: '', createdBy: user._id }]
                        }
                    })
                }}
                text='Append Note'
            />
        </div>
    );
};

export default NotesInput;