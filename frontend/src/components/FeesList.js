// functions
import { formatCurrency } from '../utils/StringUtils';

const FeesList = ({ list }) => {
    return (
        <ul className='m-0 list-group'>
            {list.map(fee => {
                return (
                    <li key={fee._id} className='list-group-item d-flex border-0 p-0 text-reset'>
                        <span>{fee.name}</span>
                        <span className='flex-grow-1 text-end'>{'$ ' + formatCurrency(fee.amount, true)}</span>
                    </li>
                )
            })}
        </ul>
    );
};

export default FeesList;