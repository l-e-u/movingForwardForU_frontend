import { useEffect } from 'react';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

// components
import GrowingTextArea from './GrowingTextArea';
import RequiredFieldsText from './RequiredFieldsText';

const FeeForm = ({
    amount,
    description,
    error,
    handleSubmit,
    isDisabled,
    isLoading,
    name,
    setFee,
}) => {


    // remove non-digits and format number 1000000 to 1,234,567
    const formatNumber = (n) => n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const formatCurrency = (value, onBlur = false) => {
        let validatedNumString = null;

        const decimalPosition = value.indexOf('.');

        // if value is floating, validate both sides
        if (decimalPosition >= 0) {
            let leftSide = value.substring(0, decimalPosition);
            let rightSide = value.substring(decimalPosition);

            // remove non-digits
            leftSide = formatNumber(leftSide);
            rightSide = formatNumber(rightSide);

            // gets rid of leading zeros, helps keep the commas proper
            if (leftSide.charAt(0) === '0') leftSide = leftSide.substring(1);

            // if all that's entered is a decimal
            if (!leftSide) leftSide += '0';

            // on blur, make sure there's 2 digits after the decimal
            if (onBlur) rightSide += '00';

            // limit the right side to only 2 digits for cents
            rightSide = rightSide.substring(0, 2);

            // join integers by decimal
            validatedNumString = leftSide + '.' + rightSide;
        }
        else {
            validatedNumString = formatNumber(value);
            // gets rid of leading zeros, helps keep the commas proper
            if (validatedNumString.length > 1 && validatedNumString.charAt(0) === '0') validatedNumString = validatedNumString.substring(1);
            if (onBlur) validatedNumString += '.00';
        };

        return validatedNumString;
    };

    // validate that the input represents a currency
    useEffect(() => {
        setFee(prev => {
            return { ...prev, amount: formatCurrency(amount) }
        });
    }, [amount]);

    const handleOnChange = (value) => {
        setFee(prev => {
            return { ...prev, ...value };
        });
    };

    return (
        <form
            className='d-flex flex-column gap-2'
            onSubmit={e => {
                e.preventDefault();

                handleSubmit();
            }}
        >
            <RequiredFieldsText />

            <div className='form-floating'>
                <input
                    className={'form-control' + (error?.name ? ' is-invalid' : '')}
                    id='name'
                    name='name'
                    onBlur={e => handleOnChange({ name: removeExtraSpaces(e.target.value.trim()) })}
                    onChange={e => handleOnChange({ name: e.target.value })}
                    placeholder='Name'
                    type='text'
                    value={name}
                />
                <label htmlFor='name' className='form-label required'>
                    Name
                    {error?.name && <span className='ms-1 text-danger'>{': ' + error.name.message}</span>}
                </label>
            </div>

            <div className='input-group'>
                <span className='input-group-text'>$</span>
                <div className='form-floating'>
                    <input
                        className={'form-control' + (error?.amount ? ' is-invalid' : '')}
                        id='amount'
                        name='amount'
                        onBlur={e => handleOnChange({ amount: formatCurrency(e.target.value, true) })}
                        onChange={e => handleOnChange({ amount: e.target.value })}
                        pattern="^\d{1,3}(,\d{3})*(\.\d+)?$"
                        placeholder='Amount'
                        step={0.01}
                        title='Needs to be a currency.'
                        type='text'
                        value={amount}
                    />
                    <label htmlFor='amount' className='form-label required'>
                        Amount
                        {error?.amount && <span className='ms-1 text-danger'>{': ' + error.amount.message}</span>}
                    </label>
                </div>
            </div>

            <div className='form-floating'>
                <GrowingTextArea
                    className={'form-control' + (error?.description ? ' is-invalid' : '')}
                    id='description'
                    name='description'
                    onBlur={e => handleOnChange({ description: e.target.value.trim() })}
                    onChange={e => handleOnChange({ description: e.target.value })}
                    placeholder='Description'
                    type='text'
                    value={description}
                />
                <label htmlFor='description' className='form-label required'>
                    Description
                    {error?.description && <span className='ms-1 text-danger'>{': ' + error.description.message}</span>}
                </label>
            </div>

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>
                {isLoading ? 'Saving...' : 'Save'}
            </button>
        </form>
    )
};

export default FeeForm;