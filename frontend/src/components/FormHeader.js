const FormHeader = ({ text, children }) => {
    return (
        <div className='d-flex justify-content-between align-items-center'>
            <h2 className='m-0 fs-3' >{text}</h2>
            {children}
        </div>
    );
};

export default FormHeader;