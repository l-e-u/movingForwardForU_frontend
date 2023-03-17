// components
import XButton from './XButton';

// used for Edit/Create forms. contains the model that's being edited/created with an x button to cancel the action
const FormHeader = ({ text, handleCloseForm }) => {
    return (
        <div className='d-flex justify-content-between align-items-center background-navy p-3 rounded-top'>
            <h2 className='ps-2 m-0 fs-3 text-white' >{text}</h2>
            
                <XButton handleOnClick={handleCloseForm} />
        </div>
    );
};

export default FormHeader;