import { useEffect } from 'react';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

const StatusSearchSelect = ({ status, setJob, inputError, inputErrorMessage }) => {
    const { getStatuses, error, isLoading } = useGetStatuses();
    const { statuses } = useStatusesContext();
    const hasSelected = !!status;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            try {
                await getStatuses();

            } catch (error) {
                console.log('Could not fetch, check your network.');
            };
        })();
    }, []);

    if (hasSelected) {
        return (
            <CancellableOption
                value={status.name}
                required={true}
                label='Status'
                handleCancelOnClick={() => {
                    setJob(prev => {
                        const updated = { ...prev };
                        updated.status = null;
                        return updated;
                    });
                }} />

        );
    };

    return (
        <AutoCompleteSelect
            labelText='Status'
            isRequired={true}
            setJob={setJob}
            handleOnClickListItem={doc => {
                return () => {
                    setJob(prev => {
                        const updated = { ...prev };
                        updated.status = doc;
                        return updated;
                    });
                };
            }}
            getListedItemText={value => value.name}
            filterSuggestions={(stautusDoc, text) => stautusDoc.name.toLowerCase().includes(text)}
            inputError={inputError}
            inputErrorMessage={inputErrorMessage}
            documents={statuses ?? []}
            errorLoading={error}
            isLoading={isLoading} />
    );
};

export default StatusSearchSelect;