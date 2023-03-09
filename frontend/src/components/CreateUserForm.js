import { useState } from 'react';

// hooks
import { useRegisterUser } from '../hooks/useRegisterUser';

// components
import FormHeader from './FormHeader';
import UserForm from './UserForm';
import CloseFormButton from './XButton';

const CreateUserForm = ({ setShowThisForm }) => {
    const { registerUser, error, isLoading } = useRegisterUser();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        comments: '',
        isAdmin: false,
    });

    return (
        <>
            <FormHeader text='New User'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <UserForm
                error={error}
                isDisabled={isLoading}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await registerUser(user)
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }}
                setUser={setUser}
                user={user}
            />
        </>
    );
};

export default CreateUserForm;