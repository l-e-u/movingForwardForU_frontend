import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useVerifyEmail } from '../hooks/useVerifyEmail';

// assets
import logo from '../assets/movingForwardArrows.svg';

// components
import LoadingDocuments from '../components/LoadingDocuments';
import Modal from '../components/Modal';
import SetPasswordForm from '../components/SetPasswordForm';

const Verify = () => {
   const [user, setUser] = useState(null);

   const { verifyEmail, error, isLoading } = useVerifyEmail();

   const showRedirectMessage = () => error || user?.hasPassword;
   const showForm = () => user && !user.hasPassword;

   // on first mount only, check if the email token is still valid and get user
   useEffect(() => {
      verifyEmail(existingUser => setUser(existingUser));
   }, []);

   useEffect(() => {
      let timeoutID;

      if (error || user?.hasPassword) {
         timeoutID = setTimeout(() => {
            window.location.replace('/');
         }, 5000);
      };

      return () => clearTimeout(timeoutID);
   }, [error, user]);

   return (
      <>
         <div
            className='d-flex align-items-start justify-content-center justify-content-lg-start bg-white position-absolute top-0 start-0 w-100 h-100'
            style={{ color: 'var(--mainPalette2)' }}>
            <div className='d-flex align-items-center justify-content-center gap-3 pt-3 ps-lg-4'>
               <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
               <h1 className='fs-5 m-0'>Moving Forward for U</h1>
            </div>
         </div>

         <AnimatePresence mode='wait'>
            <Modal blurBackground={true} maxWidth='400px'>
               {isLoading && <LoadingDocuments />}

               {
                  showRedirectMessage() &&
                  <p className='whiteSpace-preWrap m-0'>
                     {`The link is no longer valid. You'll be redirected to the login page.\n\nIf you were trying to set your password, click on 'Forgot Password'.`}
                  </p>
               }

               {
                  showForm() &&
                  <SetPasswordForm user={user} />
               }
            </Modal>
         </AnimatePresence>
      </>
   );
};

export default Verify;