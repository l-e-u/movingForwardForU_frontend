import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// componenets
import FormHeader from '../components/FormHeader';
import LoadingDocuments from '../components/LoadingDocuments';
import Modal from '../components/Modal';
import SubmitButton from '../components/SubmitButton';

// hooks
import { useLogin } from '../hooks/useLogin';
import { useResetPassword } from '../hooks/useResetPassword';
import { useAuthContext } from '../hooks/useAuthContext';

// assets
import logo from '../assets/movingForwardArrows.svg';

const Login = () => {
   const { user } = useAuthContext();

   const { login, error, isLoading } = useLogin();
   const { resetPassword, resetPasswordEmailSent, error: resetPasswordError, isLoading: isLoadingResetPassword } = useResetPassword();

   // state to hold user input
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   // uses the input's validitay function to check if email pattern is valid
   const emailIsValid = () => {
      const emailInput = document.getElementById('formLogin').email;
      const isValid = emailInput.checkValidity();

      if (!isValid) emailInput.reportValidity();

      return isValid;
   };

   const showForm = () => !isLoadingResetPassword && !resetPasswordEmailSent;

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

   // classes, styling, and framer-motion variants
   const formClasses = 'login';

   const iconClasses = 'position-absolute top-50 translate-middle';
   const iconStyles = { left: '1.5rem' };

   const inputClasses = 'form-control border-end border-bottom rounded-4 mb-2';
   const inputStyles = { borderColor: 'transparent', backgroundColor: 'var(--bs-gray-100)', paddingLeft: '2.5rem', fontSize: '14px' };

   // error identification
   const errorEmailInput = error?.path === 'email' || resetPasswordError?.path === 'email';
   const errorPasswordInput = error?.path === 'password' || error?.path === 'ObjectID';

   if (error?.path === 'ObjectID') error.message = 'Wrong Password';

   return (
      <>
         <div
            className='position-fixed top-0 start-0 w-100 h-100 bg-white'
            style={{ color: 'var(--mainPalette2)' }}>
            <div className='d-flex align-items-center justify-content-lg-start justify-content-center gap-3 ps-lg-5 pt-3'>
               <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
               <h1 className='fs-5 m-0'>Parcel Manager</h1>
            </div>
         </div>

         <AnimatePresence mode='wait'>
            {!user &&
               <Modal blurBackdrop={false} maxWidth='400px'>
                  {isLoadingResetPassword && <LoadingDocuments />}

                  {resetPasswordEmailSent &&
                     <p className='whiteSpace-preWrap m-0'>{`An email has been sent.\nPlease check your inbox to reset your password.`}</p>
                  }

                  {showForm() &&
                     <form id='formLogin' className={formClasses} onSubmit={handleSubmit}>

                        <FormHeader text='Welcome back!' />
                        <p className='text-secondary fs-smaller'>Let's start by logging into your account.</p>

                        {/* email input */}
                        <div className='form-floating position-relative'>
                           <i className={`bi bi-envelope ${iconClasses}`} style={iconStyles}></i>
                           <input
                              className={inputClasses}
                              id='email'
                              name='email'
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder='Email'
                              style={inputStyles}
                              type='email'
                              value={email} />
                           <label htmlFor='email' className='ps-5'>
                              {errorEmailInput ?
                                 <span className='ms-1 text-danger'>{error?.message || resetPasswordError?.message}</span>
                                 :
                                 'Email'
                              }
                           </label>
                        </div>

                        {/* password input */}
                        <div className='form-floating position-relative'>
                           <i className={`bi bi-shield-lock ${iconClasses}`} style={iconStyles}></i>
                           <input
                              className={inputClasses}
                              id='password'
                              name='password'
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder='Password'
                              style={inputStyles}
                              type='password'
                              value={password}
                           />
                           <label htmlFor='password' className='ps-5'>
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
                                 className='border-0 d-flex ms-auto mb-4'
                                 onClick={handleResetPassword}
                                 style={{ color: 'var(--mainPalette4)', backgroundColor: 'transparent' }}
                                 type='button'
                              >
                                 Forgot Password?
                              </button>
                           }
                        </div>

                        <div className='d-flex justify-content-end'>
                           <SubmitButton
                              buttonText={isLoading ? 'Logging in' : 'Log in'}
                              buttonType='submit'
                              isSubmittingForm={isLoading || isLoadingResetPassword}
                              isDisabled={isLoading || isLoadingResetPassword}
                           />
                        </div>
                     </form>
                  }
               </Modal >
            }
         </AnimatePresence>
      </>
   );
};

export default Login;