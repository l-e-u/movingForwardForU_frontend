const ShowCreateFormButton = ({ text, handleOnClick, isDisabled = false }) => {
    return (
        <button
            className={'rounded-pill d-block ms-auto btn-action'}
            disabled={isDisabled}
            onClick={handleOnClick}
            style={{ width: '200px' }}
            type='button'
        >
            {text}
        </button>
    );
};

export default ShowCreateFormButton;