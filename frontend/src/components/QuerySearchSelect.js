import { useState, useEffect } from 'react';

const QuerySearchSelect = ({ documents, property, hasError, errorMsg, label, isRequired }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(documents);

  return (
    <div className='form-floating mb-2'>
      <input
        className={'form-control' + (hasError ? ' is-invalid' : '')}
        aria-label='Customer'
        type='text'
        name='customer'
        id='customer'
        placeholder='Search...'
        value={query}
        onChange={(e) => setQuery(e.target.value)} />
      <label htmlFor='customer' className={'form-label' + (isRequired ? ' required' : '')}>
        {label}
        {hasError && <span className='inputError'>{errorMsg}</span>}
      </label>
      <ul className='list-group'>
        {documents.map(doc => {
          return <li key={doc._id} className='list-group-item'>{doc[property]}</li>;
        })
        }
      </ul>
    </div>
  );
};

export default QuerySearchSelect;