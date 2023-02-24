import { useState } from 'react';
import CardContainer from '../components/CardContainer.js';
import { useLogin } from '../hooks/useLogin.js';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(username, password);
    };

    return (
        <div className='flex-grow-1 mx-auto mt-5 mb-3' style={{ maxWidth: '350px' }}>
            <CardContainer>
                <form className='login' onSubmit={handleSubmit}>
                    <h2 className='fs-3 mb-4'>Login</h2>

                    <div className='form-floating mb-2'>
                        <input
                            className='form-control'
                            placeholder='Username'
                            type='text'
                            name='username'
                            id='username'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <label htmlFor='username'>Username</label>
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
                        <label htmlFor='password'>Password</label>
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>
                        Login
                    </button>
                    {error && <div className='error'>{error}</div>}
                </form>
            </CardContainer>
        </div>
    )
};

export default Login;