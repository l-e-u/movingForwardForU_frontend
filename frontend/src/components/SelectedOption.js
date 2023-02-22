import XButton from './XButton';

const SelectedOption = ({ text, handleOnClick }) => {
    return (
        <div className='d-flex justify-content-between align-items-center ps-2 mb-2'>
            <span>{text}</span>
            <XButton handleOnClick={handleOnClick} />
        </div>
    );
};

export default SelectedOption;