import { useEffect, useState } from 'react';

// hooks
import { useDebounceQuery } from '../hooks/useDebounceQuery';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';


const AutoCompleteSelect = ({
    text,
    setJob,
    handleOnClickListItem,
    property,
    nestedProperty,
    inputError,
    inputErrorMessage,
    documents,
    isLoading,
    errorLoading
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const debounceQuery = useDebounceQuery(query);

    // executes on every debounceQuery change, sets suggestions based on query
    useEffect(() => {
        (async () => {
            setSuggestions([]);
            const input = removeExtraSpaces(debounceQuery).trim().toLowerCase();

            if (input) {
                const matches = documents.filter(doc => doc[nestedProperty].toLowerCase().includes(input));
                setSuggestions(matches);
            };

            if (!input) setSuggestions(documents);
        })();
    }, [debounceQuery]);


    // searches for matching status names based on query input, on focus, a space is set as a value to all available selections, on blur, query is emptied to hide suggestions
    return (
        <div className='position-relative mb-2'>
            <div className='form-floating'>
                <input
                    className={'form-control' + (inputError ? ' is-invalid' : '')}
                    aria-label={'autoComplete' + text}
                    type='text'
                    disabled={isLoading}
                    name={'autoComplete' + text}
                    id={'autoComplete' + text}
                    placeholder='Search...'
                    value={query}
                    onBlur={() => setQuery('')}
                    onFocus={() => setQuery(' ')}
                    onChange={(e) => setQuery(e.target.value)} />
                <label htmlFor={'autoComplete' + text} className='form-label required'>
                    {isLoading ? 'Loading...' : text}
                    {inputError && <span className='inputError'>{inputErrorMessage}</span>}
                </label>
            </div>

            {/* list of suggestions based on debouncedQuery value, clicking on an item sets that document to property in job and it's displayed on the DOM with the value of the nested property */}
            {debounceQuery &&
                <ul className='list-group shadow selectList'>
                    {suggestions.map(doc => {
                        const { _id } = doc;
                        const value = doc[nestedProperty];
                        return (
                            <li
                                key={_id}
                                className='list-group-item'
                                onClick={handleOnClickListItem(doc)}>
                                {value}
                            </li>)
                    })
                    }
                </ul>
            }
            {errorLoading && <p className='text-danger'>Could not load. Check your network.</p>}
        </div>
    );
};

export default AutoCompleteSelect;