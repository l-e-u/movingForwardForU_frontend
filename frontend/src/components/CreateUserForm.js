import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useRegisterUser } from '../hooks/useRegisterUser';

// components
import FormHeader from './FormHeader';
import UserForm from './UserForm';

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
        <CSSTransition
            appear={true}
            classNames='scale-'
            in={true}
            timeout={500}
        >
            < div className='shadow'>
                <FormHeader text='New User' handleCloseForm={() => setShowThisForm(false)} />

                <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>

                    <UserForm
                        error={error}
                        isDisabled={isLoading}
                        isLoading={isLoading}
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
                </div>
            </div>
        </CSSTransition>
    );
};

export default CreateUserForm;