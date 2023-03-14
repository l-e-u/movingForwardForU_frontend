const Card = ({ header, body, footer }) => {
    return (
        <div className='position-relative shadow d-md-flex'>
            <div
                className='background-navy text-white p-3 rounded-top rounded-md-top-end-0 rounded-md-bottom-start'
                style={{ flex: '0 0 200px' }}
            >
                {header}
            </div>
            <div
                className='background-white flex-grow-1 pt-3 px-3 pb-1 rounded-bottom rounded-md-bottom-start-0 rounded-md-top-end'
                style={{ flex: '1 1 0px' }}
            >
                {body}

                <div className='text-end mt-3'>
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Card;