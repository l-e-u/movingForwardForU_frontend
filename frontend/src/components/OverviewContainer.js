const OverviewContainer = (props) => {
    return (
        <div className='shadow-sm theme-light rounded-2 position-relative my-4 p-3'>
            {props.children}
        </div>
    );
};

export default OverviewContainer;