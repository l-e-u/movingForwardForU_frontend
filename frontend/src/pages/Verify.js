import { useState } from 'react';
import { useParams } from 'react-router';

// components
import CardContainer from '../components/CardContainer.js';
import PasswordChecklist from 'react-password-checklist';

// hooks
import { useVerify } from '../hooks/useVerify.js';

const Verify = () => {
    const { token } = useParams();
    const { name } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const { verify, error, isLoading } = useVerify();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await verify({ token, password, confirmPassword });
    };

    return (
        <div className='flex-grow-1 mx-auto my-3' style={{ maxWidth: '350px' }}>
            <CardContainer>
                <form className='verify' onSubmit={handleSubmit}>
                    <h2 className='fs-3 mb-0'>
                        Welcome,
                    </h2>

                    <h3 className='mb-3'>{name + '!'}</h3>

                    {error?.token ?
                        <p className='text-danger'>{error.token.message}</p> :
                        <>
                            <p>Please set your password to complete your account.<br />Afterwards you'll be able to login.</p>

                            <div className='form-floating mb-2'>
                                <input
                                    className='form-control'
                                    placeholder='Password'
                                    type='password'
                                    name='password'
                                    id='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                <label htmlFor='password'>
                                    Password
                                    {error?.password && <span className='ms-1 text-danger'>{': ' + error.password.message}</span>}
                                </label>
                            </div>

                            <div className='form-floating mb-3'>
                                <input
                                    className='form-control'
                                    placeholder='Confirm Password'
                                    type='password'
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                                <label htmlFor='confirmPassword'>
                                    Confirm Password
                                    {error?.password && <span className='ms-1 text-danger'>{': ' + error.password.message}</span>}
                                </label>
                            </div>

                            <PasswordChecklist
                                rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                                minLength={8}
                                value={password}
                                valueAgain={confirmPassword}
                                onChange={isValid => setPasswordIsValid(isValid)}
                                iconComponents={{
                                    InvalidIcon: <i className='text-danger bi bi-x me-1' style={{ paddingTop: '.125rem' }}></i>,
                                    ValidIcon: <i className='text-success bi bi-check me-1'></i>
                                }} />

                            <button
                                type='submit'
                                disabled={isLoading || !passwordIsValid}
                                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>
                                {(isLoading ? 'Saving...' : 'Submit')}
                            </button>
                        </>
                    }
                </form>
            </CardContainer>
        </div >
    )
};

export default Verify;