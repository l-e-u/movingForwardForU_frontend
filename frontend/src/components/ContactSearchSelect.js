import { useEffect } from 'react';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import SmallHeader from './SmallHeader';
import SelectedOption from './SelectedOption';
import AutoCompleteSelect from './AutoCompleteSelect';

const ContactSearchSelect = ({ customer, setJob, inputError, inputErrorMessage }) => {
    const { getContacts, error, isLoading } = useGetContacts();
    const { contacts } = useContactsContext();
    const hasSelected = !!customer;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            try {
                await getContacts();

            } catch (error) {
                console.log('Could not fetch, check your network.')
            };
        })();
    }, []);

    if (hasSelected) {
        if (hasSelected) {
            return (
                <div className='ps-1'>
                    <SmallHeader isRequired={true} text='Customer' />
                    <SelectedOption text={customer.organization} handleOnClick={() => {
                        setJob(prev => {
                            const updated = { ...prev };
                            updated.customer = null;
                            return updated;
                        });
                    }} />
                </div>
            );
        };
    };

    return (
        <AutoCompleteSelect
            labelText='Customer'
            isRequired={true}
            setJob={setJob}
            handleOnClickListItem={doc => {
                return () => {
                    setJob(prev => {
                        const updated = { ...prev };
                        updated.customer = doc;
                        return updated;
                    });
                };
            }}
            getListedItemText={value => value.organization}
            filterSuggestions={(contactDoc, text) => contactDoc.organization.toLowerCase().includes(text)}
            inputError={inputError}
            inputErrorMessage={inputErrorMessage}
            documents={contacts ?? []}
            errorLoading={error}
            isLoading={isLoading} />
    );
};

export default ContactSearchSelect;