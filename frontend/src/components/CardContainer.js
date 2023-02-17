const CardContainer = ({ children }) => {
    return (
        <div className='shadow-sm theme-light rounded-2 position-relative p-4'>
            {children}
        </div>
    );
};

export default CardContainer;