const LoadingDocuments = () => {
    return (
        <div className='d-flex justify-content-center align-items-center text-green'>
            {/* for accessibility purposes, 'roles' property and nested span element are included */}
            <div className='spinner-border' role='status'>
                <span className='visually-hidden'>Loading...</span>
            </div>
        </div>
    );
};

export default LoadingDocuments;