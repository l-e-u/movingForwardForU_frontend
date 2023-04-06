import { useEffect, useState } from 'react';
import Select from 'react-select';

// context
import { useAuthContext } from '../hooks/useAuthContext';
import { useFeesContext } from '../hooks/useFeesContext';

const FeesSelect = ({ defaultFees, setDefaultFees }) => {
    const { user } = useAuthContext();
    const { fees, dispatch } = useFeesContext();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const options = !fees ? [] : fees.map(fee => {
        const { _id, amount, name } = fee;
        const isNegative = amount < 0;
        const currency = `$${isNegative ? '(' : ''}${amount}${isNegative ? ')' : ''}`;

        return { label: name + ' ' + currency, value: _id };
    });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/fees', { headers: { 'Authentication': `Bearer ${user.token}` } });

            // expecting all contacts
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);

                dispatch({ type: 'SET_FEES', payload: json });
            };
        })();
    }, [dispatch, user]);

    return (
        <Select
            className='text-reset'
            closeMenuOnSelect={false}
            isDisabled={isLoading}
            isLoading={isLoading}
            isMulti
            isSearchable
            placeholder='Set Default Fees...'
            options={options}
            onChange={selected => {
                setDefaultFees(selected.map(opt => fees.find(fee => fee._id === opt.value)));
            }}
            value={defaultFees.map(fee => options.find(option => fee._id === option.value))}
        />
    );
};

export default FeesSelect;