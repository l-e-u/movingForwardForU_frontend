import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// components
// import ActionButton from '../components/ActionButton';
// import Card from '../components/Card';
// import PasswordChecklist from 'react-password-checklist';
// import LoadingDocuments from '../components/LoadingDocuments';
// import PageContentWrapper from '../components/Page';

// hooks
import { useVerify } from '../hooks/useVerify';

const Verify = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { emailToken } = useParams();
   const { name } = useParams();
   const { resetPassword } = useParams();

   const { verify, error: verifyError, isLoading: verifyIsLoading } = useVerify();

   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [password, setPassword] = useState('');
   const [passwordIsValid, setPasswordIsValid] = useState(false);
   const [user, setUser] = useState(null);

   const errorPasswordInput = verifyError?.path === 'password';
   const errorConfirmPasswordInput = verifyError?.path === 'confirmPassword';

   // on first mount only, check if the email token is still valid and get user
   useEffect(() => {
      (async () => {
         setIsLoading(true);

         // don't want to show the error if user is trying to rectify, so null error at the start
         setError(null);

         // on mount, check if the token is valid, if invalid, show error
         // if the user is already verified, then direct them to login
         const response = await fetch(`${API_BASE_URL}/api/users/verify/${emailToken}/${resetPassword}`, { method: 'POST' });

         // expecting a found user
         const json = await response.json();

         if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            return false;
         };

         if (response.ok) {
            setIsLoading(false);
            setUser(json);
            return true;
         };
      })();
   }, [API_BASE_URL, emailToken, resetPassword]);

   // redired to login page when token has expired OR when the user has already been verified
   useEffect(() => {
      let timeoutId;
      if (error?.token || user?.isVerified) {
         timeoutId = setTimeout(() => {
            window.location.replace('/');
         }, 3500);
      };

      return () => clearTimeout(timeoutId);
   }, [user, error]);

   const handleSubmit = (e) => {
      e.preventDefault();

      verify({
         _id: user._id,
         password,
         confirmPassword
      }).then(isVerified => {
         if (isVerified) {
            setUser(prev => {
               return {
                  ...prev,
                  isVerified: true
               }
            })
         };
      });
   };
return <></>
//   return (
//       <PageContentWrapper>
//          <div className='flex-grow-1 mx-auto my-3' style={{ maxWidth: '1000px' }}>
//             <Card
//               header={<>
//                   <h2 className='fs-3 mb-0'>
//                      Welcome,
//                   </h2>
//                   <h3 className='mb-0'>{name + '!'}</h3>
//               </>}

//               body={<>
//                   {/* while loading, display the loading spinner */}
//                   {isLoading && <LoadingDocuments />}

//                   {/* show error when token has expired */}
//                   {error?.token && <p>Oops! This link has expired.</p>}

//                   {/* succesful confirmation */}
//                   {user?.isVerified && <p>You're good to go!</p>}

//                   {/* if the email token has expired OR the user has already been verified, direct them to the login screen */}
//                   {(error?.token || user?.isVerified) &&
//                      <>
//                         <p style={{ whiteSpace: 'pre-wrap' }}>You will be redirected to the login page in 3 seconds...
//                         </p>
//                         <div className='spinner-border spinner-border-sm' role='status'>
//                           <span className='visually-hidden'>Loading...</span>
//                         </div>
//                      </>
//                   }

//                   {/* have the user set their password to verify their email */}
//                   {(!error && !user?.isVerified) &&
//                      <form className='verify' onSubmit={handleSubmit}>

//                         <p>Please set your password to complete your account.<br />Afterwards you'll be able to login.</p>

//                         <div className='form-floating mb-2'>
//                           <input
//                               className='form-control'
//                               placeholder='Password'
//                               type='password'
//                               name='password'
//                               id='password'
//                               onChange={(e) => setPassword(e.target.value)}
//                               value={password}
//                           />
//                           <label htmlFor='password'>
//                               {errorPasswordInput ? <span className='ms-1 text-danger'>{verifyError.message}</span> : 'Password'}
//                           </label>
//                         </div>

//                         <div className='form-floating mb-3'>
//                           <input
//                               className='form-control'
//                               placeholder='Confirm Password'
//                               type='password'
//                               name='confirmPassword'
//                               id='confirmPassword'
//                               onChange={(e) => setConfirmPassword(e.target.value)}
//                               value={confirmPassword}
//                           />
//                           <label htmlFor='confirmPassword'>
//                               {errorConfirmPasswordInput ? <span className='ms-1 text-danger'>{verifyError.message}</span> : 'Confirm Password'}

//                           </label>
//                         </div>

//                         <PasswordChecklist
//                           rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
//                           minLength={8}
//                           value={password}
//                           valueAgain={confirmPassword}
//                           onChange={isValid => setPasswordIsValid(isValid)}
//                           iconComponents={{
//                               InvalidIcon: <i className='text-danger bi bi-x me-1' style={{ paddingTop: '.125rem' }}></i>,
//                               ValidIcon: <i className='text-success bi bi-check me-1'></i>
//                           }} />

//                         <br />
//                         <ActionButton
//                           alignX='right'
//                           isDisabled={verifyIsLoading || !passwordIsValid}
//                           text={(verifyIsLoading ? 'Saving...' : 'Submit')}
//                           type='submit'
//                         />
//                      </form>
//                   }
//               </>}
//             />
//          </div >
//       </PageContentWrapper>
//   )
};

export default Verify;