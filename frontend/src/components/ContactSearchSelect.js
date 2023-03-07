import { useEffect } from 'react';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';

const ContactSearchSelect = ({ customer, setJob, inputError, inputErrorMessage }) => {
    const { getContacts, error, isLoading } = useGetContacts();
    const { contacts } = useContactsContext();
    const hasSelected = !!customer;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {

            await getContacts();

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