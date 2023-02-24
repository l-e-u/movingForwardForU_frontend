const StatusOverview = ({ name, description }) => {
    return (
        <div>
            <h2 className='text-primary fs-5 mb-2'>{name}</h2>
            <p className='m-0'>{description}</p>
        </div>
    );
};

export default StatusOverview;