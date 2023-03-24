import { useEffect } from 'react';

// functions
import { formatCurrency, removeExtraSpaces } from '../utils/StringUtils';

// components
import GrowingTextArea from './GrowingTextArea';
import RequiredFieldsText from './RequiredFieldsText';
import ActionButton from './ActionButton'

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

    // validate that the input represents a currency
    useEffect(() => {
        setFee(prev => {
            return { ...prev, amount: formatCurrency(amount) }
        });
    }, [amount, setFee]);

    const handleOnChange = (value) => {
        setFee(prev => {
            return { ...prev, ...value };
        });
    };

    return (
        <form className='d-flex flex-column gap-2' onSubmit={e => {
            e.preventDefault();

            handleSubmit();
        }}
        >
            <RequiredFieldsText />

            <div className='d-flex flex-column flex-md-row gap-2 gap-md-3'>
                <div className='form-floating w-md-75'>
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

                <div className='input-group w-md-25'>
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

            <ActionButton
                alignX='right'
                text={(isLoading ? 'Saving...' : 'Save')}
                type='submit'
                isDisabled={isDisabled}
            />
        </form>
    )
};

export default FeeForm;