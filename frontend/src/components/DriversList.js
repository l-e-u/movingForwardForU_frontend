const DriversList = ({ list }) => {
    if (list.length === 0) {
        return <div className="text-danger my-2">No drivers have been assigned.</div>
    }
    return (
        <ul className="m-0 list-style-none">

        </ul>
    );
};

export default DriversList;