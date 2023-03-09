import { useState } from 'react';

// hooks
import { useUpdateUser } from '../hooks/useUpdateUser';

// functions
import { noCharChanges } from '../utils/StringUtils';

// components
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';
import UserForm from './UserForm';
import CautionNotice from './CautionNotice';

const EditUserForm = ({ prev, setShowThisForm }) => {
    const { updateUser, error, isLoading } = useUpdateUser();
    const [user, setUser] = useState(prev);
    const updatedProperties = {};

    // check for any character changes in the values
    // any changed properties are added to updatedProperties object
    if (!noCharChanges(prev.firstName, user.firstName)) updatedProperties.firstName = user.firstName;
    if (!noCharChanges(prev.lastName, user.lastName)) updatedProperties.lastName = user.lastName;
    if (!noCharChanges(prev.comments ?? '', user.comments ?? '')) updatedProperties.comments = user.comments;
    if (prev.isActive !== user.isActive) updatedProperties.isActive = user.isActive;
    if (prev.isAdmin !== user.isAdmin) updatedProperties.isAdmin = user.isAdmin;

    // any empty object means there has been no character changes on any inputs
    const noInputChanges = Object.keys(updatedProperties).length === 0;

    return (
        <>
            <FormHeader text='Edit User'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <CautionNotice text='Changes will also reflect on all other documents with this user.' />

            <CautionNotice text={`Updating an email will require ${user.firstName} to verify it. They won't be able to login until they do.`} />

            <UserForm
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await updateUser({
                        _id: prev._id,
                        profile: { ...updatedProperties }
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }}
                setUser={setUser}
                user={user}
            />
        </>
    )
};

export default EditUserForm;