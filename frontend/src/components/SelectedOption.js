import XButton from './XButton';

const SelectedOption = ({ text, handleOnClick }) => {
    return (
        <div className='d-flex justify-content-between align-items-center rounded-pill ps-4 py-0 mt-1 mb-2 alert alert-dark'>
            <span>{text}</span>
            <XButton handleOnClick={handleOnClick} />
        </div>
    );
};

export default SelectedOption;