const ErrorLoadingDocuments = ({ docType }) => {
    return (
        <div className='text-danger'>{`Could not load ${docType}. Check your network and refresh.`}</div>
    );
};

export default ErrorLoadingDocuments;