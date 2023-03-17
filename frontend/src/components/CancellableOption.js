// components
import XButton from './XButton'

const CancellableOption = ({ value, handleCancelOnClick, label }) => {
    return (
        <div
            className='rounded ps-3 pe-0 py-2 border d-flex align-items-center'
            style={{ backgroundColor: 'var(--bs-gray-100)' }}
        >
            <div className='text-reset flex-grow-1 lh-1'>
                <small className='smallPrint' style={{ opacity: '.65' }}>{label}</small>
                <div className='my-1'>{value}</div>
            </div>
            <div className='text-action'><XButton handleOnClick={handleCancelOnClick} /></div>
        </div >
    )
};

export default CancellableOption;