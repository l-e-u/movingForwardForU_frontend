import SmallHeader from './SmallHeader';
import XButton from './XButton';

const SelectedOption = ({ text, handleOnClick }) => {
    return (
        <div className='ps-1'>
            <SmallHeader text='Status' />
            <div className='d-flex justify-content-between align-items-center ps-2 mb-2'>
                <span>{text}</span>
                <XButton handleOnClick={handleOnClick} />
            </div>
        </div>
    );
};

export default SelectedOption;