import SmallHeader from "./SmallHeader";

const DriversList = ({ list }) => {
    return (
        <div>
            <SmallHeader text={'Driver' + ((list.length > 1) ? 's' : '')} />
            <ul className="m-0 list-group">
                {list.map(driver => {
                    return <li key={driver._id} className="list-group-item border-0 p-0 me-sm-5">{`${driver.firstName} ${driver.lastName.charAt(0)}.`}</li>
                })}
            </ul>
        </div>
    );
};

export default DriversList;