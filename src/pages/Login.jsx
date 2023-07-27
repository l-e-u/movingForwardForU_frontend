import { useState } from 'react';
import { motion } from 'framer-motion';

// componenets
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import SmallHeader from '../components/SmallHeader';

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
   const formStyles = {};

   const inputContainerVariants = {
      mount: {
         border: '1px solid transparent'
      },
      onFocus: {
         border: '1px solid var(--mainPalette4)'
      }
   };

   // styling for the submit button
   const submitButtonClasses = 'border-0 rounded-pill position-absolute top-100 start-50 text-white px-5 py-3';
   const submitButtonStyles = { backgroundColor: 'var(--mainPalette4)' }
   const submitButtonVariants = {
      mount: {
         transform: 'translate(-50%,-50%) scale(1)'
      },
      onHover: {
         transform: 'translate(-50%,-50%) scale(1.1)',
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette4)',
      }
   };


   return (
      <>
         <div className='d-flex align-items-center p-4 ps-5' style={{ color: 'var(--mainPalette3)' }}>
            <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
            <h1 className='fs-5 m-0 ps-3'>Moving Forward for U</h1>
         </div>

         <Modal blurBackdrop={false}>
            <p></p>
            <form id='formLogin' className={formClasses} onSubmit={handleSubmit} style={formStyles}>
               <div className='fs-6 mb-3' style={{ fontWeight: '500' }}>Login</div>

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

               <motion.div className='formInput bg-light px-4 py-2 rounded-4' variants={inputContainerVariants} initial='mount' whileFocus='onFocus'>
                  {/* <label className='d-block' htmlFor='email'><SmallHeader text='Email' /></label> */}
                  <motion.input
                     className='border-0'
                     id='email'
                     name='email'
                     style={{ backgroundColor: 'transparent', outline: 'none' }}
                     type='text'
                     value={email}
                     variants={inputContainerVariants}
                  />
               </motion.div>

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
                        className='border-0 d-flex ms-auto mb-4'
                        onClick={handleResetPassword}
                        style={{ color: 'var(--mainPalette4)', backgroundColor: 'transparent' }}
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

               <motion.button
                  className={submitButtonClasses}
                  disabled={(isLoading || isLoadingResetPassword) ? true : false}
                  initial='mount'
                  style={submitButtonStyles}
                  type='submit'
                  variants={submitButtonVariants}
                  whileHover='onHover'
               >
                  {isLoading ? 'Logging in...' : 'Login'}
               </motion.button>
            </form>
         </Modal >
      </>
   );
};

export default Login;