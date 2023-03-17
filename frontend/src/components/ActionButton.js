const ShowCreateFormButton = ({
    alignX,
    alignY,
    handleOnClick,
    text,
    isDisabled = false,
    type = 'button' }) => {
    let alignClass;

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
            {text}
        </button>
    );
};

export default ShowCreateFormButton;