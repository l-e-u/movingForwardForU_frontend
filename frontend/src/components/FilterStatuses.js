import { useEffect, useState } from 'react';
import Select from 'react-select';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useStatusesContext } from '../hooks/useStatusesContext';


const FilterStatuses = ({ filter, setStatusFilter }) => {
    const { user } = useAuthContext();
    const { statuses, dispatch } = useStatusesContext();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const options = !statuses ? [] : statuses.map(status => ({ label: status.name, value: status._id }));

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/statuses', { headers: { 'Authentication': `Bearer ${user.token}` } });

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

                dispatch({ type: 'SET_STATUSES', payload: json });
            };
        })();
    }, [dispatch, user]);

    return (
        <Select
            closeMenuOnSelect={false}
            isDisabled={error || isLoading}
            isLoading={isLoading}
            isMulti
            isSearchable
            isClearable
            placeholder='Select Status...'
            options={options}
            onChange={selected => setStatusFilter(selected.map(sel => sel.value))}
            value={filter.map(status => options.find(option => status === option.value))}
        />
    );
};

export default FilterStatuses;