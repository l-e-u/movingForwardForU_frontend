const StatusOverview = ({ name, description }) => {
    return (
        <div>
            <h2 className="text-primary fs-5 m-0">{name}</h2>
            <p className="m-0">{description}</p>
        </div>
    );
};

export default StatusOverview;