import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// components
import CreateFeeForm from '../components/CreateFeeForm';
import Page from '../components/Page';

// hooks
import { useFeesContext } from '../hooks/useFeesContext';
import { useGetFees } from '../hooks/useGetFees';
import { useGetStatuses } from '../hooks/useGetStatuses';

// functions
import { formatCurrency } from '../utils/StringUtils';

const Fees = () => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees, dispatch } = useFeesContext();

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

   useEffect(() => {
      getFees();
   }, []);

   return (
      <Page >
         <CreateFeeForm hideForm={() => setShowCreateForm(false)} showForm={showCreateForm} />

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

export default Fees;