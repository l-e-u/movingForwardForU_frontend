// functions
import { formatCurrency } from '../utils/StringUtils';

const CurrencyInput = ({ amount, setCurrency }) => {
    return (
        <div className='input-group' style={{ maxWidth: '300px' }}>
            <span className='input-group-text py-0 px-1'>$</span>
            <input
                className='form-control py-0 ps-2 pe-1'
                id='currency'
                name='currency'
                onBlur={e => {
                    const string = e.target.value;
                    if (string !== '') setCurrency({ input: formatCurrency(string, true) });
                }}
                onChange={e => setCurrency({ input: formatCurrency(e.target.value) })}
                pattern="^\d{1,3}(,\d{3})*(\.\d+)?$"
                step={0.01}
                title='Needs to be a currency.'
                type='text'
                value={amount ?? ''}
            />
        </div>
    );
};

export default CurrencyInput;