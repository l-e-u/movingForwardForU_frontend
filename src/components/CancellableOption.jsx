import { CSSTransition } from 'react-transition-group';

// components
import XButton from './XButton'

const CancellableOption = ({ value, handleCancelOnClick, label }) => {
    return (
        <CSSTransition
            appear={true}
            classNames='fade-'
            in={true}
            timeout={500}
        >
            <div
                className='rounded ps-3 pe-0 py-2 border d-flex align-items-center'
                style={{ backgroundColor: 'var(--bs-gray-100)' }}
            >
                <div className='text-reset flex-grow-1 lh-1'>
                    <small className='smallPrint text-break' style={{ opacity: '.65' }}>{label}</small>
                    <div className='my-1 text-break'>{value}</div>
                </div>
                <div className='text-action'><XButton handleOnClick={handleCancelOnClick} /></div>
            </div >
        </CSSTransition>
    )
};

export default CancellableOption;