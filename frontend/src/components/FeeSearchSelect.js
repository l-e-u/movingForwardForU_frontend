import { useState, useEffect } from 'react';

// hooks
import { useFeesContext } from '../hooks/useFeesContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import SmallHeader from './SmallHeader';
import CancellableOption from './CancellableOption';
import { useAuthContext } from '../hooks/useAuthContext';

const FeeSearchSelect = ({ feesList, setJob }) => {
    const [duplicateError, setDuplicateError] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const { fees, dispatch } = useFeesContext();
    const { user } = useAuthContext();

    const dupErrorMessage = 'Has already been added.';
    const hasAddedFees = feesList.length > 0;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/fees', { headers: { 'Authentication': `Bearer ${user.token}` } });

            // expecting all fees
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setIsLoading(false);
                setError(json.error);
            };

            if (response.ok) {
                setIsLoading(false);
                setError(false);
                dispatch({ type: 'SET_FEES', payload: json });
            }

        })();
    }, []);

    return (
        <div>
            <AutoCompleteSelect
                labelText='Fees'
                isRequired={false}
                setJob={setJob}
                handleOnClickListItem={doc => {
                    return () => {
                        setDuplicateError(null);

                        // check if the fee hasn't already been added. throw an error to avoid duplicates
                        setJob(prev => {
                            if (prev.fees.some(fee => fee._id === doc._id)) {
                                setDuplicateError(true);
                                return prev;
                            };

                            const updated = { ...prev };
                            updated.fees = [...prev.fees, doc];
                            return updated;
                        });
                    };
                }}
                getListedItemText={value => value.name}
                filterSuggestions={(feeDoc, text) => feeDoc.name.toLowerCase().includes(text.toLowerCase())}
                inputError={duplicateError}
                inputErrorMessage={dupErrorMessage}
                documents={fees ?? []}
                errorLoading={error}
                isLoading={isLoading} />

            {hasAddedFees &&
                <div className='mt-2 d-flex flex-column gap-1'>
                    <SmallHeader text={'FEE' + (feesList.length > 1 ? 'S' : '')} />
                    {feesList.map((fee, index) => {
                        const { _id, amount, name } = fee;

                        return (
                            <div key={_id}>
                                <CancellableOption
                                    value={amount}
                                    label={name}
                                    labelAlt={'Fee' + index}
                                    required={false}
                                    handleCancelOnClick={() => {
                                        setDuplicateError(null);
                                        setJob(prev => {
                                            const updated = { ...prev };
                                            updated.fees = feesList.filter(f => f._id !== _id);
                                            return updated;
                                        });
                                    }}
                                    preLabel='$'
                                />
                            </div>
                        );
                    })}
                </div>}
        </div>
    );
};

export default FeeSearchSelect;