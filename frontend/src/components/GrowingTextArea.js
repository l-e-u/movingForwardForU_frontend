import { useEffect, useRef } from 'react';

const GrowingTextArea = (props) => {
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
        <textarea
            style={{ resize: 'none' }}
            ref={textAreaRef}
            rows={1}
            {...props}
        />
    );
};

export default GrowingTextArea;