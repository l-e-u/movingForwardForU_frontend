import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// componenets
import ActionButton from '../components/ActionButton';
import Card from '../components/Card';

// hooks
import { useLogin } from '../hooks/useLogin';
import { useResetPassword } from '../hooks/useResetPassword';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { login, error, isLoading } = useLogin();
   const { resetPassword, resetPasswordEmailSent, error: resetPasswordError, isLoading: isLoadingResetPassword } = useResetPassword();

   const errorEmailInput = error?.path === 'email' || resetPasswordError?.path === 'email';
   const errorPasswordInput = error?.path === 'password';

   // uses the input's validitay function to check if email pattern is valid
   const emailIsValid = () => {
      const emailInput = document.getElementById('formLogin').email;
      const isValid = emailInput.checkValidity();

      if (!isValid) emailInput.reportValidity();

      return isValid;
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!emailIsValid()) return;

      login(email, password);
   };

   const handleResetPassword = (e) => {
      e.preventDefault();

      if (!emailIsValid()) return;

      resetPassword(email);
   };

   return (
      <div className='flex-grow-1 mx-auto mt-5 mb-3 p-5' style={{ maxWidth: '750px' }}>
         <Card
            header={<h2 className='fs-3'>Login</h2>}
            body={
               <form id='formLogin' className='login' onSubmit={handleSubmit}>

                  {/* email input */}
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
                        {errorEmailInput ?
                           <span className='ms-1 text-danger'>{error?.message || resetPasswordError?.message}</span>
                           :
                           'Email'
                        }
                     </label>
                  </div>

                  {/* password input */}
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
                        {errorPasswordInput ?
                           <span className='ms-1 text-danger'>{error.message}</span>
                           :
                           'Password'
                        }
                     </label>
                  </div>
                  <div>
                     {isLoadingResetPassword && <span className='spinner-border spinner-border-sm me-1' role='status' aria-hidden='true'></span>}

                     {(!isLoadingResetPassword && !resetPasswordEmailSent) &&
                        <button
                           className='border-0 text-action d-flex ms-auto'
                           onClick={handleResetPassword}
                           style={{ backgroundColor: 'transparent' }}
                           type='button'
                        >
                           Forgot Password?
                        </button>
                     }
                  </div>

                  {resetPasswordEmailSent &&
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
                     isDisabled={isLoading || isLoadingResetPassword}
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