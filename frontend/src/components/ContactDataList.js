import { useEffect, useState } from 'react';
import { useContactsContext } from '../hooks/useContactsContext';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const ContactDataList = ({ setJob, error, token, value }) => {
    const { contacts, dispatch } = useContactsContext();
    const [input, setInput] = useState(value);

    const errorFromContactSelection = error?.customer;

    const handleOnChange = (e) => {
        const value = removeExtraSpaces(e.target.value);
        const trimmedValue = value.trim()
        const contact = contacts.find(c => c.organization === trimmedValue);

        if (contact) {
            setJob(prev => {
                return ({
                    ...prev,
                    customer: contact._id
                })
            });
        };

        setInput(value);
    };

    useEffect(() => {
        const fetchContacts = async () => {
            const response = await fetch('/api/contacts', {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_CONTACTS', payload: json });
            };

            if (!response.ok) {
                console.error(json);
            };
        };

        fetchContacts();
    }, [dispatch]);

    return (
        <div className='form-floating mb-2'>
            <input
                className={'form-select' + (errorFromContactSelection ? ' is-invalid' : '')}
                aria-label='Customer'
                list='customerDataList'
                type='text'
                name='customer'
                id='customer'
                placeholder='Search or select...'
                value={input}
                onChange={handleOnChange} />
            <label htmlFor='customer' className='form-label required'>
                Customer
                {errorFromContactSelection && <span className='inputError'>{error.customer.message}</span>}
            </label>
            <datalist id='customerDataList'>
                {contacts && contacts.map(contact => {
                    const { _id, organization } = contact;

                    return <option key={_id} value={organization}>{organization}</option>
                })}
            </datalist>
        </div>
    );
};

export default ContactDataList;