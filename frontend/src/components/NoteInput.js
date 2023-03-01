import { useEffect, useRef } from 'react';

const NoteInput = ({ input, handleOnChange, hasError, error }) => {
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (textAreaRef) {
            // reset the height momentarily to get the correct scrollHeight for the textarea
            textAreaRef.current.style.height = '0px';

            const scrollHeight = textAreaRef.current.scrollHeight;

            // set the height directly, outside of the render loop
            // trying to set this with state or a ref will produce an incorrect value.
            textAreaRef.current.style.height = scrollHeight + 6 + 'px';
        };
    });

    return (
        <div className='form-floating'>
            <textarea
                ref={textAreaRef}
                name='note'
                className={'form-control' + (error ? ' is-invalid' : '')}
                id='note'
                placeholder='Note'
                rows={1}
                value={input ?? ''}
                onBlur={e => e.target.value.trim()}
                onChange={handleOnChange}
            />
            <label htmlFor='note' className='form-label'>
                Note
                {error && <span className='inputError'>{error.message}</span>}
            </label>
        </div>
    );
};

export default NoteInput;