// functions
import { useState } from 'react';
import { formatCurrency } from '../utils/StringUtils';

// takes the amount and formats it to a string representing a currency (0,000,000.00). when the input is empty, the value set is null, when the amount is null, the currncy string is empty
const CurrencyInput = ({ amount, setCurrency }) => {
    const [currencyString, setCurrencyString] = useState(amount === null ? '' : formatCurrency(amount, true));

    return (
        <div className='input-group w-100 h-100'>
            <span className='input-group-text py-0 px-1'>$</span>
            <input
                className='form-control py-0 ps-2 pe-1'
                id='currency'
                name='currency'
                onBlur={e => {
                    const input = e.target.value;

                    // once the input is NaN, set the currency to null
                    if (isNaN(input) || input === '') {
                        setCurrency({ input: null });
                        setCurrencyString('');
                    }
                    else {
                        setCurrencyString(formatCurrency(input, true));
                    };
                }}
                onChange={e => {
                    const input = e.target.value;
                    console.log(input);
                    if (!isNaN(input) || input === '-') {
                        const value = input === '' ? null : Number(e.target.value.replace(/,/g, ''));

                        setCurrencyString(formatCurrency(e.target.value));
                        setCurrency({ input: value });
                    };
                }}
                pattern="^[-]?\d{1,3}(,\d{3})*(\.\d+)?$"
                step={0.01}
                title='Needs to be a currency.'
                type='text'
                value={currencyString}
            />
        </div>
    );
};

export default CurrencyInput;