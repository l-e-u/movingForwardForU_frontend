const ShowCreateFormButton = ({ text, handleOnClick }) => {
    return (
        <button
            type='button'
            className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
            onClick={handleOnClick}>
            {text}
        </button>
    );
};

export default ShowCreateFormButton;