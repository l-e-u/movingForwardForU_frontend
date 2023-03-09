const CautionNotice = ({ text }) => {
    return (
        <div className='d-flex'>
            <i className='bi bi-exclamation-triangle-fill text-warning pe-2'></i>
            <p className='flex-grow-1 m-0'>
                {text}
            </p>
        </div>
    );
};
export default CautionNotice;