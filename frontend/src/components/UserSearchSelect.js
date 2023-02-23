import { useState, useEffect } from 'react';
import { useGetUsers } from '../hooks/useGetUsers'
import { useUsersContext } from '../hooks/useUsersContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import SmallHeader from './SmallHeader';
import SelectedOption from './SelectedOption';

const UserSearchSelect = ({ drivers, setJob }) => {
    const { getUsers, error, isLoading } = useGetUsers();
    const { users } = useUsersContext();

    const [inputError, setInputError] = useState(null);

    const inputErrorMessage = 'Has already been added.';
    const hasAddedDrivers = drivers.length > 0;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            try {
                await getUsers();

            } catch (error) {
                console.log('Could not fetch, check your network.')
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
                    console.log('name:', fullName);
                    console.log('input:', text)
                    console.log(fullName.includes(text))
                    return fullName.includes(text);
                }}
                inputError={inputError}
                inputErrorMessage={inputErrorMessage}
                documents={users ?? []}
                errorLoading={error}
                isLoading={isLoading} />

            {hasAddedDrivers &&
                <div className='ps-1'>
                    <SmallHeader text={'Driver' + (drivers.length > 1 ? 's' : '')} />
                    {drivers.map(driver => {
                        const { _id, firstName, lastName } = driver;
                        const fullName = firstName + ' ' + lastName;

                        return (
                            <SelectedOption key={_id} text={fullName} handleOnClick={() => {
                                setInputError(null);
                                setJob(prev => {
                                    const updated = { ...prev };
                                    updated.drivers = drivers.filter(d => d._id != _id);
                                    return updated;
                                });
                            }} />
                        );
                    })}
                </div>}
        </div>
    );
};

export default UserSearchSelect;