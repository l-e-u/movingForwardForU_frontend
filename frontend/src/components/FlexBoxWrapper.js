const FlexBoxWrapper = ({ children }) => {
    return (
        <div className='d-flex flex-column gap-4'>
            {children}
        </div>
    )
};

export default FlexBoxWrapper;