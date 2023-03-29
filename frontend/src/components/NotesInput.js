import { CSSTransition } from 'react-transition-group';

// components
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import XButton from './XButton';
import ActionButton from './ActionButton';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import Counter from './Counter';

// user can create a list of notes, each note has its own functions to update and delete itself
const NotesInput = ({
    error,
    notes,
    setError,
    setJob,
}) => {
    const { user } = useAuthContext();
    const numOfNotes = notes.length;
    const hasNotes = numOfNotes > 0;

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
            <div className='d-flex gap-1'>
                <SmallHeader text={'Note' + (numOfNotes > 1 ? 's' : '')} />
                {(numOfNotes > 1) && <Counter number={numOfNotes} />}
            </div>
            {hasNotes &&
                <ul className='list-group d-flex flex-column gap-3 overflow-scroll rounded-0 py-2' style={{ maxHeight: '700px', borderTop: '1px solid var(--darkBlue)', borderBottom: '1px solid var(--darkBlue)' }}>
                    {notes.map((note, index) => {
                        const noteId = note._id;
                        const inputSubjectError = error?.notes ? error?.notes[index]?.subject : null;

                        return (
                            <CSSTransition
                                appear={true}
                                classNames='fade-'
                                in={true}
                                timeout={500}
                                key={noteId || index}
                            >
                                <li className='position-relative'>
                                    {/* the X buttons removes the note from the job */}
                                    <div className='position-absolute top-0 end-0 text-action'>
                                        <XButton handleOnClick={() => handleDeleteOnClick(index)} />
                                    </div>

                                    {/* input for the subject line and message textarea */}
                                    <input
                                        className={'form-control-plaintext rounded ps-2 py-1 pe-0' + (inputSubjectError ? ' is-invalid' : '')}
                                        placeholder={'* Subject' + (inputSubjectError ? ` : ${inputSubjectError}` : '')}
                                        onBlur={e => handleOnChange({ subject: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ subject: e.target.value }, index)}
                                        style={{ backgroundColor: 'var(--bs-gray-200)' }}
                                        value={note.subject}
                                    />
                                    <GrowingTextArea
                                        value={note.message}
                                        className='form-control-plaintext px-1'
                                        placeholder='Message'
                                        onBlur={e => handleOnChange({ message: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ message: e.target.value }, index)}
                                    />

                                    {/* button to remove the attachment will delete the property off of job */}
                                    {note.attachment?.filename ?
                                        <button
                                            className='btn btn-sm text-action border-0 p-0 text-start'
                                            onClick={() => handleOnChange({ attachment: null }, index)}
                                            type='button'
                                        >
                                            {'Remove ' + note.attachment.filename}
                                        </button> :

                                        <input
                                            accept='image/png, image/jpeg'
                                            className='form-control form-control-sm'
                                            id='file'
                                            name='file'
                                            onChange={e => {
                                                const file = e.target.files[0];

                                                if (file) {
                                                    const filename = file.name;
                                                    const filetype = file.type;
                                                    const reader = new FileReader();

                                                    // define what happens when the reader is loaded
                                                    reader.onload = function (readerEvent) {
                                                        const image = new Image();

                                                        // define when the image is loaded
                                                        image.onload = function () {
                                                            const canvas = document.createElement('canvas');
                                                            const max_size = 800; /* max size */
                                                            let width = image.width;
                                                            let height = image.height;

                                                            if (width > height) {
                                                                if (width > max_size) {
                                                                    height *= max_size / width;
                                                                    width = max_size;
                                                                }
                                                            } else {
                                                                if (height > max_size) {
                                                                    width *= max_size / height;
                                                                    height = max_size;
                                                                }
                                                            }
                                                            canvas.width = width;
                                                            canvas.height = height;
                                                            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                                                            canvas.toBlob(function (blob) {
                                                                handleOnChange(
                                                                    {
                                                                        attachment: {
                                                                            file: new File([blob], filename, { type: filetype }),
                                                                            filename: file?.name
                                                                        }
                                                                    },
                                                                    index
                                                                );
                                                            });
                                                        }
                                                        // load the image
                                                        image.src = readerEvent.target.result;
                                                    }
                                                    // load the reader
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            type='file'
                                        />
                                    }
                                </li>
                            </CSSTransition>
                        );
                    })}
                </ul>
            }
            <ActionButton
                isDisabled={error?.notes}
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
        </div >
    );
};

export default NotesInput;