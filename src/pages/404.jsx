import { AnimatePresence } from 'framer-motion';

// componenets
import FormHeader from '../components/FormHeader';
import Modal from '../components/Modal';

// assets
import logo from '../assets/movingForwardArrows.svg';
import { useEffect } from 'react';
import SubmitButton from '../components/SubmitButton';
import Button from '../components/Button';

const NotFound404Page = ({ setSelectedLink }) => {

   const redirectToHome = () => window.location.replace('/');

   useEffect(() => setSelectedLink(null), []);

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

               <FormHeader text='404' />

               <p className='text-secondary fs-smaller mt-3 mb-5'>The page you were looking for does not exist.</p>

               <Button handleClick={redirectToHome}>
                  <span>Let's go home!</span>
               </Button>
            </Modal >
         </AnimatePresence>
      </>
   );
};

export default NotFound404Page;