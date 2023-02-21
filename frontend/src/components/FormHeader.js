import CloseFormButton from './CloseFormButton';

const FormHeader = ({ text, children }) => {
    return (
        <div className='d-flex justify-content-between align-items-center'>
            <h3 className='m-0' >{text}</h3>
            {children}
        </div>
    );
};

export default FormHeader;