import { useState } from 'react';
import { motion } from 'framer-motion';

// componenets
import FormHeader from '../components/FormHeader';
import Modal from '../components/Modal';
import SubmitButton from '../components/SubmitButton';

// hooks
import { useLogin } from '../hooks/useLogin';
import { useResetPassword } from '../hooks/useResetPassword';

// assets
import logo from '../assets/movingForwardArrows.svg';

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

   // classes, styling, and framer-motion variants for form
   const formClasses = 'login position-relative bg-white rounded-4 p-4 text-reset shadow';
   const formStyles = { width: '90vw', maxWidth: '400px' };

   const iconClasses = 'position-absolute top-50 translate-middle';
   const iconStyles = { left: '1.5rem' };

   const inputClasses = 'form-control rounded-4 mb-2';
   const inputStyles = { borderColor: 'transparent', backgroundColor: 'var(--bs-gray-100)', paddingLeft: '2.5rem' };

   return (
      <>
         <div className='d-flex align-items-center justify-content-center justify-content-md-start pt-4 ps-0 ps-md-5' style={{ color: 'var(--mainPalette3)' }}>
            <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
            <h1 className='fs-5 m-0 ps-3'>Moving Forward for U</h1>
         </div>

         <Modal blurBackdrop={false}>
            <form id='formLogin' className={formClasses} onSubmit={handleSubmit} style={formStyles}>

               <FormHeader text='Welcome back!' />
               <p className='text-secondary fs-smaller'>Let's start by loggin into your account.</p>

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

               {resetPasswordEmailSent && <div className='alert alert-success py-1 mt-2'>Email sent. Please check your inbox.</div>}

               <SubmitButton defaultText='Login' loadingText='Loggin In' isLoading={isLoading || isLoadingResetPassword} />
            </form>
         </Modal >
      </>
   );
};

export default Login;