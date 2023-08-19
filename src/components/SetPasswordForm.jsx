import { useState } from 'react'

// hooks
import { useSetUserPassword } from '../hooks/useSetUserPassword';

// components
import FormHeader from './FormHeader';
import SubmitButton from './SubmitButton';

const SetPasswordForm = ({ user }) => {
   const { setUserPassword, error, isLoading } = useSetUserPassword();

   const { _id, firstName } = user;

   // input state
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const passwordIconClass = `bi bi-eye${showPassword ? '' : '-slash'}`;
   const confirmPasswordIconClass = `bi bi-eye${showConfirmPassword ? '' : '-slash'}`;

   const iconClasses = 'position-absolute top-50 translate-middle';
   const iconStyles = { left: '1.5rem' };

   const inputClasses = 'form-control border-end border-bottom rounded-4';
   const inputStyles = { borderColor: 'transparent', backgroundColor: 'var(--bs-gray-100)', paddingLeft: '2.5rem', fontSize: '14px' };

   const errorPasswordInput = error?.path === 'password';
   const errorConfirmPasswordInput = error?.path === 'confirmPassword';

   const xIconClasses = 'bi bi-x-circle me-2 text-danger';
   const checkIconClasses = 'bi bi-check-circle me-2 text-success';

   const submitButtonText = isLoading ? 'Saving' : 'Save';

   // password requirements
   const minLength = 8;
   const atLeastOneNumberPattern = /\d/;
   const atLeastOneCapitalLetterPattern = /[A-Z]/;
   const atLeastOneSpecialCharacterPattern = /[`~!@#$%^&*()_+{}|:<>?]/;

   const hasMinLength = () => password.length >= minLength;
   const hasNumber = () => atLeastOneNumberPattern.test(password);
   const hasCapitalLetter = () => atLeastOneCapitalLetterPattern.test(password);
   const hasSpecialCharacter = () => atLeastOneSpecialCharacterPattern.test(password);
   const hasSpace = () => password.includes(' ');
   const areSame = () => password === confirmPassword;

   const meetsRequirements = () => hasMinLength() && hasNumber() && hasCapitalLetter() && hasSpecialCharacter() && !hasSpace() && areSame();

   const handleSubmit = async (e) => {
      e.preventDefault();

      const registeredUser = await setUserPassword({
         _id,
         password,
         confirmPassword
      });

      if (registeredUser) window.location.replace('/');
   };

   return (
      <form onSubmit={handleSubmit} >
         <FormHeader text={`Welcome,\n${firstName}!`} />

         <p className='fs-smaller text-secondary mt-1'>Before you can login, please set your password.</p>

         {/* password input */}
         <div className='form-floating position-relative d-flex mb-3'>
            <i
               className={`${passwordIconClass} ${iconClasses}`}
               onClick={e => setShowPassword(!showPassword)}
               role='button'
               style={iconStyles}
            >
            </i>
            <input
               className={inputClasses}
               id='password'
               name='password'
               onChange={(e) => setPassword(e.target.value)}
               placeholder='Password'
               style={inputStyles}
               type={showPassword ? 'text' : 'password'}
               value={password}
            />
            <label htmlFor='password' className='ps-5'>
               {errorPasswordInput ?
                  <span className='ms-1 text-danger'>{verifyError.message}</span>
                  :
                  'Password'
               }
            </label>
         </div>

         {/* confirm password input */}
         <div className='form-floating position-relative mb-3'>
            <i
               className={`${confirmPasswordIconClass} ${iconClasses}`}
               onClick={e => setShowConfirmPassword(!showConfirmPassword)}
               role='button'
               style={iconStyles}
            >
            </i>
            <input
               className={inputClasses}
               id='confirmPassword'
               name='confirmPassword'
               onChange={(e) => setConfirmPassword(e.target.value)}
               placeholder='Confirm Password'
               style={inputStyles}
               type={showConfirmPassword ? 'text' : 'password'}
               value={confirmPassword}
            />
            <label htmlFor='confirmPassword' className='ps-5'>
               {errorConfirmPasswordInput ?
                  <span className='ms-1 text-danger'>{verifyError.message}</span>
                  :
                  'Confirm Password'
               }
            </label>
         </div>

         {/* password checklist */}
         <p className='text-secondary fs-smaller mb-2'>Checklist of Requirements</p>
         <ul className='m-0 ps-3' style={{ listStyle: 'none' }}>
            <li><i className={hasMinLength({ string: password, length: minLength }) ? checkIconClasses : xIconClasses}></i>{`At least ${minLength} characters`}</li>
            <li><i className={hasNumber() ? checkIconClasses : xIconClasses}></i>A number</li>
            <li><i className={hasCapitalLetter() ? checkIconClasses : xIconClasses}></i>A capital letter</li>
            <li><i className={hasSpecialCharacter() ? checkIconClasses : xIconClasses}></i>A special character</li>
            <li><i className={password && !hasSpace() ? checkIconClasses : xIconClasses}></i>No spaces</li>
            <li><i className={(password && confirmPassword) && areSame() ? checkIconClasses : xIconClasses}></i>Matching passwords</li>
         </ul>

         <div className='d-flex justify-content-end mt-3'>
            <SubmitButton
               buttonText={submitButtonText}
               buttonType='submit'
               isDisabled={isLoading || !meetsRequirements()}
               isSubmittingForm={isLoading}
            />
         </div>
      </form>
   );
};

export default SetPasswordForm;