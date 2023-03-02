const DriversList = ({ list }) => {
    return (
        <ul className="m-0 list-group">
            {list.map(driver => {
                const fullName = driver.firstName + ' ' + driver.lastName;

                return <li key={driver._id} className="list-group-item border-0 p-0 me-sm-5">{fullName}</li>
            })}
        </ul>
    );
};

export default DriversList;