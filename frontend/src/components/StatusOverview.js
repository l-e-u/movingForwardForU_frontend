const StatusOverview = ({ name, description }) => {
    return (
        <div>
            <h4 className="text-primary">{name}</h4>
            <p className="m-0">{description}</p>
        </div>
    );
};

export default StatusOverview;