import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// componenets
import FormHeader from '../components/FormHeader';
import LoadingDocuments from '../components/LoadingDocuments';
import Modal from '../components/Modal';

// hooks
import { useLogin } from '../hooks/useLogin';
import { useAuthContext } from '../hooks/useAuthContext';

// assets
import logo from '../assets/movingForwardArrows.svg';

const Demo = ({ setSelectedLink }) => {
   const { user } = useAuthContext();

   const { login, error, isLoading } = useLogin();

   const [dialogueDone, setDialogueDone] = useState(false);

   const redirectToHome = () => window.location.replace('/');

   const containerVariants = {
      mount: {
         opacity: 0
      },
      animate: {
         opacity: 1,
         transition: {
            delay: 1,
            when: 'beforeChildren',
            staggerChildren: 1.5
         }
      }
   };

   const childVariants = {
      mount: {
         opacity: 0
      },
      animate: {
         opacity: 1,
      }
   }

   useEffect(() => {
      setSelectedLink(null);
      login('demo@yopmail.com', 'demoPass123!');

      setTimeout(() => {
         setDialogueDone(true);
      }, 3000)
   }, []);

   return (
      <>
         <div
            className='d-flex align-items-start justify-content-center justify-content-md-start'
            style={{ color: 'var(--mainPalette2)' }}>
            <div className='d-flex align-items-center justify-content-center gap-3 pt-3 ps-lg-4'>
               <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
               <h1 className='fs-5 m-0'>Parcel Manager</h1>
            </div>
         </div>

         <AnimatePresence mode='wait'>
            <Modal blurBackdrop={false} maxWidth='400px'>

               <FormHeader text='Demo' />

               <motion.div className='mt-3' variants={containerVariants} initial='mount' animate='animate'>

                  <motion.p className='my-2' variants={childVariants}>Hey there!</motion.p>
                  <motion.p className='my-2' variants={childVariants}>Hang on while I log you in as a dispatcher and driver, I'll let you know when it's ready...</motion.p>

                  <motion.div className='mt-2' variants={childVariants}>
                     {
                        isLoading ?
                           <div className='spinner-border spinner-border-sm mt-2' role='status'>
                              <span className='visually-hidden'>Loading...</span>
                           </div>
                           :
                           <a className='text-reset cursor-pointer' onClick={redirectToHome}>Let's go!</a>
                     }
                  </motion.div>
               </motion.div>

            </Modal >
         </AnimatePresence>
      </>
   );
};

export default Demo;