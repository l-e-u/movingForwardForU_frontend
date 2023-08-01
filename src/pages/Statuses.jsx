import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import CreateStatusForm from '../components/CreateStatusForm';
import Page from '../components/Page';
import SmallHeader from '../components/SmallHeader';

const Statuses = () => {
   const { getStatuses, error, isLoading } = useGetStatuses();
   const { statuses } = useStatusesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'px-5 py-1 ms-auto position-relative rounded d-flex justify-content-center align-items-center';
   const addButtonStyles = { backgroundColor: 'var(--mainPalette9)', border: '1px solid var(--mainPalette8)', color: 'var(--mainPalette4)' };
   const addButtonVariants = {
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette9)',
      }
   };

   // styling for the list container
   const listClasses = 'feeList d-flex flex-wrap gap-3 p-3 m-0';
   const listStyles = { listStyle: 'none' };

   // styling for an item in the list
   const itemClasses = 'feeItem rounded-3 px-1 pb-1 pt-3 lightGradient';
   const itemStyles = {
      flex: '1 1 250px',
      maxWidth: '500px'
   };

   // styling for input headers
   const headerStyles = { color: 'var(--mainPalette4)', fontWeight: '500' };

   // get statuses once
   useEffect(() => {
      getStatuses();
   }, []);

   return (
      <Page >
         <CreateStatusForm hideForm={() => setShowCreateForm(false)} showForm={showCreateForm} />

         {/* button to display the new job form */}
         <div className='px-3 pt-3'>
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
         <ul className={listClasses} style={listStyles}>
            {
               statuses.map(status => {
                  const { _id, name, description } = status;
                  return (
                     <li key={_id} className={itemClasses} style={itemStyles}>
                        {/* <GradientCard> */}
                        <div className='container-fluid h-100 d-flex flex-column'>

                           <div className='row mb-2'>
                              <div className='col-sm-2' style={headerStyles}><SmallHeader text='Name' /></div>
                              <div className='col-sm-10'>{name}</div>
                           </div>

                           <div className='row flex-grow-1 rounded-2 py-2' style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                              <div className='col-sm-12'>
                                 <span className='text-secondary'><SmallHeader text='Description' /></span>
                                 <div>{description}</div>
                              </div>
                           </div>
                        </div>
                        {/* </GradientCard> */}
                     </li>
                  )
               })
            }
         </ul>
      </Page>
   );
};

export default Statuses;