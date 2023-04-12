import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// componenets
import ActionButton from '../components/ActionButton.js';
import Card from '../components/Card.js';

// hooks
import { useLogin } from '../hooks/useLogin.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassEmailSent, setShowForgotPassEmailSent] = useState(null);
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    };

    return (
        <div className='flex-grow-1 mx-auto mt-5 mb-3 p-5' style={{ maxWidth: '750px' }}>
            <Card
                header={<h2 className='fs-3'>Login</h2>}
                body={
                    <form className='login' onSubmit={handleSubmit}>


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
                        <div>
                            <button
                                className='border-0 text-action d-flex ms-auto'
                                onClick={() => {
                                    setShowForgotPassEmailSent(false);

                                    if (email) {
                                        (async () => {
                                            const response = await fetch('/api/users/resetPassword', {
                                                body: JSON.stringify({ email }),
                                                headers: { 'Content-Type': 'application/json' },
                                                method: 'POST',
                                            })

                                            if (response.ok) {
                                                setShowForgotPassEmailSent(true);
                                            }
                                        })();
                                    }
                                }}
                                style={{ backgroundColor: 'transparent' }}
                                type='button'
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {showForgotPassEmailSent &&
                            <CSSTransition
                                appear={true}
                                classNames='fade-'
                                in={true}
                                timeout={500}
                            >
                                <div className='alert alert-success py-1 mt-2'>Email sent. Please check your inbox.</div>
                            </CSSTransition>
                        }
                        <br />
                        <ActionButton
                            alignX='right'
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            text={(isLoading ? 'Logging in...' : 'Login')}
                            type='submit'
                        />
                    </form>
                }
            />
        </div>
    )
};

export default Login;