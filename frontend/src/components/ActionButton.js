const ShowCreateFormButton = ({
    alignX,
    alignY,
    handleOnClick,
    text,
    isDisabled = false,
    isLoading = false,
    type = 'button',
}) => {
    let alignClass;

    // sets the horizontal alignment
    switch (alignX) {
        case 'left':
            alignClass = ' me-auto';
            break;

        case 'center':
            alignClass = ' mx-auto';
            break;

        case 'right':
            alignClass = ' ms-auto';
            break;

        default:
            alignClass = '';
            break;
    }

    // sets vertical alignment
    switch (alignY) {
        case 'top':
            alignClass += ' mb-auto';
            break;

        case 'center':
            alignClass += ' my-auto';
            break;

        case 'bottom':
            alignClass += ' mt-auto';
            break;

        default:
            alignClass += '';
            break;
    }

    return (
        <button
            className={'rounded-pill d-block btn-action' + alignClass}
            disabled={isDisabled}
            onClick={handleOnClick}
            style={{ width: '200px' }}
            type={type}
        >
            {isLoading && <span className='spinner-border spinner-border-sm me-1' role='status' aria-hidden='true'></span>}
            {text}
        </button>
    );
};

export default ShowCreateFormButton;