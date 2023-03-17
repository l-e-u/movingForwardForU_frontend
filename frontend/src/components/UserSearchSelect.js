import { useState, useEffect } from 'react';

// hooks
import { useUsersContext } from '../hooks/useUsersContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import SmallHeader from './SmallHeader';
import CancellableOption from './CancellableOption';

const UserSearchSelect = ({ drivers, setJob }) => {
    const { user } = useAuthContext()
    const { users, dispatch } = useUsersContext();

    const [inputError, setInputError] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const inputErrorMessage = 'Has already been added.';
    const hasAddedDrivers = drivers.length > 0;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/users', {
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
                dispatch({ type: 'SET_USERS', payload: json });
            };
        })();
    }, []);

    return (
        <div>
            <AutoCompleteSelect
                labelText='Drivers'
                isRequired={false}
                setJob={setJob}
                handleOnClickListItem={doc => {
                    return () => {
                        setInputError(null);

                        // check if the user hasn't already been added. throw an error to avoid duplicates
                        setJob(prev => {
                            if (prev.drivers.some(driver => driver._id === doc._id)) {
                                setInputError(true);
                                return prev;
                            };

                            const updated = { ...prev };
                            updated.drivers = [...prev.drivers, doc];
                            return updated;
                        });
                    };
                }}
                getListedItemText={value => value.firstName + ' ' + value.lastName}
                filterSuggestions={(userDoc, text) => {
                    const fullName = (userDoc.firstName + ' ' + userDoc.lastName).toLowerCase();
                    return fullName.includes(text);
                }}
                inputError={inputError}
                inputErrorMessage={inputErrorMessage}
                documents={users ?? []}
                errorLoading={error}
                isLoading={isLoading} />

            {hasAddedDrivers &&
                <div className='mt-2 d-flex flex-column gap-1'>
                    <SmallHeader text={'ASSIGNED DRIVER' + (drivers.length > 1 ? 'S' : '')} />
                    <ul className='list-group d-flex flex-column gap-1' style={{ overflow: 'auto' }}>
                        {drivers.map(driver => {
                            const { _id, firstName, lastName } = driver;
                            const fullName = firstName + ' ' + lastName;

                            return (
                                <li key={_id}>
                                    <CancellableOption
                                        handleCancelOnClick={() => {
                                            setInputError(null);
                                            setJob(prev => {
                                                const updated = { ...prev };
                                                updated.drivers = drivers.filter(d => d._id !== _id);
                                                return updated;
                                            });
                                        }}
                                        label={driver.email}
                                        value={fullName}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>}
        </div>
    );
};

export default UserSearchSelect;