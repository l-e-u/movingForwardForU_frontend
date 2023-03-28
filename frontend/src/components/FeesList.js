// functions
import { formatCurrency } from '../utils/StringUtils';

const FeesList = ({ billing }) => {
    return (
        <ul className='m-0 list-group'>
            {billing.map(bill => {

                const { adjustedAmount, fee } = bill;
                const amount = adjustedAmount === null ? fee.amount : adjustedAmount;

                return (
                    <li key={fee._id} className='list-group-item d-flex border-0 p-0 text-reset'>
                        <span>{fee.name}</span>
                        {(adjustedAmount !== null) && <span className='smallPrint text-secondary ms-1'>&#8224;</span>}
                        <span className='flex-grow-1 text-end text-nowrap'>{'$ ' + formatCurrency(amount, true)}</span>
                    </li>
                )
            })}
        </ul>
    );
};

export default FeesList;