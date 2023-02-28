import { useState } from 'react';

// hooks
import { useCreateUser } from '../hooks/useCreateUser';

// components
import FormHeader from './FormHeader';
import UserForm from './UserForm';
import CloseFormButton from './XButton';

const CreateUserForm = ({ setShowThisForm }) => {
    const { createUser, error, isLoading } = useCreateUser();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        note: '',
        isAdmin: false,
    });

    return (
        <>
            <FormHeader text='New User'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <UserForm
                user={user}
                setUser={setUser}
                error={error}
                isDisabled={isLoading}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await createUser(user)
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </>
    );
};

export default CreateUserForm;