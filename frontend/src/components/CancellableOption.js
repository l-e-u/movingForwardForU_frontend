import XButton from './XButton'

const CancellableOption = ({ value, required, handleCancelOnClick, label, labelAlt = null, preLabel = null }) => {
    return (
        <div className='input-group'>
            {preLabel && <span className='input-group-text'>{preLabel}</span>}
            <div className='form-floating'>
                <input type='text' name={'selected' + (labelAlt || label)} id={'selected' + (labelAlt || label)} readOnly={true} disabled={true} defaultValue={value} className='form-control' />
                <label htmlFor={'selected' + label} className={'form-label' + (required ? ' required' : '')}>{label}</label>
            </div>
            <span className='input-group-text p-0'>
                <XButton handleOnClick={handleCancelOnClick} />
            </span>
        </div>
    );
};

export default CancellableOption;