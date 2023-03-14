const FeesList = ({ list }) => {
    return (
        <ul className='m-0 list-group'>
            {list.map(fee => {
                return <li key={fee._id} className='list-group-item border-0 p-0 me-sm-5 text-reset'>{fee.amount + ' ' + fee.name}</li>
            })}
        </ul>
    );
};

export default FeesList;