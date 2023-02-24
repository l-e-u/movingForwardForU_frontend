const FlexBoxWrapper = ({ children }) => {
    return (
        <div className='d-flex flex-wrap gap-4'>
            {children}
        </div>
    )
};

export default FlexBoxWrapper;