import { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

// components
import ActionButton from './ActionButton';
import Counter from './Counter';
import FileUploadHandler from './FileUploadHandler';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import XButton from './XButton';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

// user can create a list of notes, each note has its own functions to update and delete itself
const NotesInput = ({
    error,
    isResizingImages,
    notes,
    setError,
    setIsResizingImages,
    setJob,
    withinUploadSizeLimit,
}) => {
    const { user } = useAuthContext();

    const notesRef = useRef(null);

    const numOfNotes = notes.length;
    const hasNotes = numOfNotes > 0;

    // referred to the unordered list, scrolls to the bottom when a new note is added
    const scrollToBottom = () => {
        notesRef.current?.scroll({ top: notesRef.current?.scrollHeight, behavior: 'smooth' });
    };

    const handleOnChange = (input, index) => {
        const updatedNotes = [...notes];

        updatedNotes[index] = {
            ...updatedNotes[index],
            ...input,
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

    // smooth scroll to bottom of the list to bring into view newest note added
    useEffect(scrollToBottom, [notes]);

    return (
        <div className='d-flex flex-column gap-2'>
            <div className='d-flex gap-1'>
                <SmallHeader text={'Note' + (numOfNotes > 1 ? 's' : '')} />
                {(numOfNotes > 1) && <Counter number={numOfNotes} />}
            </div>
            {hasNotes &&
                <ul className='list-group d-flex flex-row flex-wrap gap-3 overflow-scroll rounded-0 py-2' ref={notesRef} style={{ maxHeight: '400px', borderTop: '1px solid var(--darkBlue)', borderBottom: '1px solid var(--darkBlue)' }}>
                    {notes.map((note, index) => {
                        const { _id, attachments } = note;
                        const inputSubjectError = error?.notes ? error?.notes[index]?.subject : null;

                        return (
                            <CSSTransition
                                appear={true}
                                classNames='fade-'
                                in={true}
                                timeout={500}
                                key={_id || index}
                            >
                                <li className='position-relative border rounded' style={{ backgroundColor: 'var(--bs-gray-100)', flex: '1 1 300px', maxWidth: '600px' }}>
                                    {/* the X buttons removes the note from the job */}
                                    <div className='position-absolute top-0 end-0 text-action'>
                                        <XButton handleOnClick={() => handleDeleteOnClick(index)} />
                                    </div>

                                    {/* input for the subject line and message textarea */}
                                    <input
                                        className={'form-control-plaintext text-reset text-break background-white ps-2 py-1 pe-0' + (inputSubjectError ? ' is-invalid' : '')}
                                        placeholder={'* Subject' + (inputSubjectError ? ` : ${inputSubjectError}` : '')}
                                        onBlur={e => handleOnChange({ subject: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ subject: e.target.value }, index)}
                                        value={note.subject}
                                    />
                                    <GrowingTextArea
                                        value={note.message}
                                        className='form-control-plaintext px-2 smallPrint text-reset'
                                        placeholder='Message'
                                        onBlur={e => handleOnChange({ message: e.target.value.trim() }, index)}
                                        onChange={e => handleOnChange({ message: e.target.value }, index)}
                                    />

                                    {/* only show the handler if the note already has attachments or it's within the limit */}
                                    {(withinUploadSizeLimit || attachments.length > 0) &&
                                        <div className='px-2 pb-2'> <FileUploadHandler
                                            files={attachments || []}
                                            isResizingImages={isResizingImages}
                                            setIsResizingImages={setIsResizingImages}
                                            setFiles={({ images }) => handleOnChange({ attachments: images }, index)}
                                        />
                                        </div>
                                    }
                                </li>
                            </CSSTransition>
                        );
                    })}
                </ul>
            }
            {!withinUploadSizeLimit && <div className='text-reset'>Upload size limit exceeded. You need to remove some new attachments.</div>}
            <ActionButton
                isDisabled={error?.notes || isResizingImages}
                isLoading={isResizingImages}
                handleOnClick={() => {
                    setJob(prev => {
                        return {
                            ...prev,
                            notes: [...prev.notes, { attachments: [], subject: '', message: '', createdBy: user._id }]
                        }
                    })
                }}
                text='Append Note'
            />
        </div >
    );
};

export default NotesInput;