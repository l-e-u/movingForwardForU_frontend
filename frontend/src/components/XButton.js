const XButton = ({ handleOnClick }) => {
    return (
        <button
            type='button'
            className='btn border-0 text-reset'
            onClick={handleOnClick} >
            <i className='bi bi-x'></i>
        </button>
    );
};

export default XButton;