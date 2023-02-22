const XButton = ({ handleOnClick }) => {
    return (
        <button
            type='button'
            className='btn border-0'
            onClick={handleOnClick} >
            <i className='bi bi-x-lg'></i>
        </button>
    );
};

export default XButton;