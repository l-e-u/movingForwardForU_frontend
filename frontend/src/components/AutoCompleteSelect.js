import { useEffect, useState } from 'react';

// hooks
import { useDebounceQuery } from '../hooks/useDebounceQuery';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';


const AutoCompleteSelect = ({
    labelText,
    isRequired,
    getListedItemText,
    handleOnClickListItem,
    filterSuggestions,
    inputError,
    inputErrorMessage,
    documents,
    isLoading,
    errorLoading
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState(documents);
    const debounceQuery = useDebounceQuery(query);

    // executes on every debounceQuery change, sets suggestions based on query
    useEffect(() => {
        (async () => {
            setSuggestions([]);
            const input = removeExtraSpaces(debounceQuery).trim().toLowerCase();

            if (input) {
                const matches = documents.filter(doc => filterSuggestions(doc, input));
                setSuggestions(matches);
            };

            if (!input) setSuggestions(documents);
        })();
    }, [debounceQuery, documents, filterSuggestions]);

    // searches for matching status names based on query input, on focus, a space is set as a value to all available selections, on blur, query is emptied to hide suggestions
    return (
        <div className='position-relative'>
            <div className='form-floating'>
                <input
                    className={'form-control' + (inputError ? ' is-invalid' : '')}
                    type='text'
                    aria-label={'autoComplete' + labelText}
                    disabled={isLoading}
                    name={'autoComplete' + labelText}
                    id={'autoComplete' + labelText}
                    placeholder='Search...'
                    value={query}
                    onBlur={() => setQuery('')}
                    onFocus={() => setQuery(' ')}
                    onChange={(e) => setQuery(e.target.value)} />
                <label htmlFor={'autoComplete' + labelText} className={'form-label' + (isRequired ? ' required' : '')}>
                    {isLoading ? 'Loading...' : labelText}
                    {inputError && <span className='inputError'>{inputErrorMessage}</span>}
                </label>
            </div>

            {/* list of suggestions based on debouncedQuery value, clicking on an item sets that document to property in job and it's displayed on the DOM with the value of the nested property */}
            {debounceQuery &&
                <ul className='list-group shadow selectList'>
                    {suggestions.map(doc => {
                        return (
                            <li
                                key={doc._id}
                                className='list-group-item'
                                onClick={handleOnClickListItem(doc)}>
                                {getListedItemText(doc)}
                            </li>)
                    })
                    }
                </ul>
            }
            {errorLoading && <p className='text-danger ms-1 mt-1'>Could not load. Check your network and refresh the page.</p>}
        </div>
    );
};

export default AutoCompleteSelect;