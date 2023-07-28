import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useStatusesContext } from '../hooks/useStatusesContext';
import { useGetStatuses } from '../hooks/useGetStatuses';

// components
import CreateStatusForm from '../components/CreateStatusForm';
import Page from '../components/Page';

const Statuses = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { statuses, dispatch } = useStatusesContext();
   const { user } = useAuthContext();

   const { getStatuses, error, isLoading } = useGetStatuses();

   const [showCreateForm, setShowCreateForm] = useState(false);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'border-0 px-5 py-1 my-3 ms-auto position-relative rounded d-flex justify-content-center align-items-center';
   const addButtonStyles = { backgroundColor: 'var(--mainPalette9)', color: 'var(--mainPalette4)' };
   const addButtonVariants = {
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette9)',
      }
   };

   // get statuses once
   useEffect(() => {
      getStatuses();
   }, []);

   return (
      <Page >
         <CreateStatusForm hideForm={() => setShowCreateForm(false)} showForm={showCreateForm} />

         {/* button to display the new job form */}
         <div className='px-3'>
            <motion.button
               className={addButtonClasses}
               style={addButtonStyles}
               onClick={() => setShowCreateForm(true)}
               type='button'
               variants={addButtonVariants}
               whileHover='onHover'
            >
               <i className='bi bi-plus'></i>
            </motion.button>

         </div>
      </Page>
   );
};

export default Statuses;