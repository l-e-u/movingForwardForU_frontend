import { useState } from 'react';

// componenets
import CardContainer from '../components/CardContainer.js';
import ActionButton from '../components/ActionButton.js';

// hooks
import { useLogin } from '../hooks/useLogin.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    };

    return (
        <div className='flex-grow-1 mx-auto mt-5 mb-3' style={{ maxWidth: '350px' }}>
            <CardContainer>
                <form className='login' onSubmit={handleSubmit}>
                    <h2 className='fs-3 mb-4'>Login</h2>

                    <div className='form-floating mb-2'>
                        <input
                            className='form-control'
                            placeholder='Email'
                            type='email'
                            name='email'
                            id='email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                        <label htmlFor='email'>
                            Email
                            {error?.email && <span className='ms-1 text-danger'>{': ' + error.email.message}</span>}
                        </label>
                    </div>

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

                    <br />
                    <ActionButton
                        alignX='right'
                        isDisabled={isLoading}
                        text={(isLoading ? 'Logging in...' : 'Login')}
                        type='submit'
                    />
                </form>
            </CardContainer>
        </div>
    )
};

export default Login;