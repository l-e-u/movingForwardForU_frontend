const DriversList = ({ list }) => {
    return (
        <ul className="m-0 list-group">
            {list.map(driver => {
                return <li key={driver._id} className="list-group-item border-0 p-0 me-sm-5">{`${driver.firstName} ${driver.lastName.charAt(0)}.`}</li>
            })}
        </ul>
    );
};

export default DriversList;