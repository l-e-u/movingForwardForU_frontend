import { useEffect, useState } from 'react';
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';
import { useDebounceQuery } from '../hooks/useDebounceQuery';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const StatusSearchSelect = ({ setJob, inputError }) => {
    const { getStatuses, error, isLoading } = useGetStatuses();
    const { statuses } = useStatusesContext();

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const debounceQuery = useDebounceQuery(query);

    const hasError = inputError?.status;
    const errorMsg = inputError?.status?.message;

    // gets statuses at first mount
    useEffect(() => {
        (async () => {
            await getStatuses()
                .then(data => {
                    if (data) setSuggestions(data);
                });
        })();
    }, []);

    // executes on every debounceQuery change, sets suggestions based on query
    useEffect(() => {
        (async () => {
            setSuggestions([]);
            const input = removeExtraSpaces(debounceQuery).trim().toLowerCase();

            if (input) {
                const matches = statuses.filter(status => status.name.toLowerCase().includes(input));
                setSuggestions(matches);
            };

            if (!input) setSuggestions(statuses);
        })();
    }, [debounceQuery])

    // searches for matching status names based on query input, on focus, a space is set as a value to all available selections, on blur, query is emptied to hide suggestions
    return (
        <div className='position-relative mb-2'>
            <div className='form-floating'>
                <input
                    className={'form-control' + (hasError ? ' is-invalid' : '')}
                    aria-label='Customer'
                    type='text'
                    name='customer'
                    id='customer'
                    placeholder='Search...'
                    value={query}
                    onBlur={() => setQuery('')}
                    onFocus={() => setQuery(' ')}
                    onChange={(e) => setQuery(e.target.value)} />
                <label htmlFor='customer' className='form-label required'>
                    {isLoading ? 'Loading...' : 'Status'}
                    {hasError && <span className='inputError'>{errorMsg}</span>}
                </label>
            </div>

            {/* list of suggestions based on debouncedQuery value, clicking on an item sets the status _id on the job */}
            {debounceQuery &&
                <ul className='list-group shadow selectList'>
                    {suggestions.map(doc => {
                        const { _id, name } = doc;
                        return (
                            <li
                                key={_id}
                                className='list-group-item'
                                onClick={() => {
                                    setJob(prev => {
                                        return { ...prev, status: doc };
                                    });
                                }}>
                                {name}
                            </li>)
                    })
                    }
                </ul>
            }
            {error && <p className='text-danger'>Could not load. Check your network.</p>}
        </div>
    );
};

export default StatusSearchSelect;