import { useEffect, useState } from 'react';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';

const ContactSearchSelect = ({ customer, setJob, inputError, inputErrorMessage }) => {
    const { user } = useAuthContext();
    const { contacts, dispatch } = useContactsContext();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const hasSelected = !!customer;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/contacts', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

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
                dispatch({ type: 'SET_CONTACTS', payload: json });
            };
        })();
    }, []);

    if (hasSelected) {
        if (hasSelected) {
            return (
                <CancellableOption
                    value={customer.organization}
                    required={true}
                    label='Customer'
                    handleCancelOnClick={() => {
                        setJob(prev => {
                            const updated = { ...prev };
                            updated.customer = null;
                            return updated;
                        });
                    }} />
            );
        };
    };

    return (
        <AutoCompleteSelect
            labelText='Customer'
            isRequired={true}
            setJob={setJob}
            getListedItemText={value => value.organization}
            filterSuggestions={(contactDoc, text) => contactDoc.organization.toLowerCase().includes(text)}
            inputError={inputError}
            inputErrorMessage={inputErrorMessage}
            documents={contacts ?? []}
            errorLoading={error}
            isLoading={isLoading}
            handleOnClickListItem={doc => {
                return () => {
                    setJob(prev => {
                        const updated = { ...prev };
                        updated.customer = doc;
                        return updated;
                    });
                };
            }} ß />
    );
};

export default ContactSearchSelect;