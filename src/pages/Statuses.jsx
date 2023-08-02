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
   const listClasses = 'statusesList px-md-5 py-0 px-3 m-0';
   const listVariants = {
      mount: {
         listStyle: 'none'
      },
      animation: {
         transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1
         }
      }
   };

   // styling for an item in the list
   const itemClasses = 'statusItem bg-white container rounded py-3 px-4 mb-3';
   const itemVariants = {
      mount: {
         opacity: 0,
      },
      animation: {
         opacity: 1,
         boxShadow: '0 .125rem .25rem var(--mainPalette8)'
      }
   };

   // styling for the columns
   const firstColumnClasses = 'col-sm-2 text-secondary text-sm-end';
   const firstColumnStyles = { fontWeight: '500' }

   const secondColumnClasses = 'col-sm-10'

   // get statuses once
   useEffect(() => {
      getStatuses();
   }, []);

   return (
      < >
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

         {/* each item on the list will be staggered as they fade in */}

         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               statuses.map(status => (
                  <motion.li key={status._id} className={itemClasses} variants={itemVariants} >
                     <div className='row mb-2'>
                        <div className={firstColumnClasses + ' mt-auto'}><SmallHeader text='Name' /></div>
                        <div className={secondColumnClasses + ' fs-5'} style={firstColumnStyles}>{status.name}</div>
                     </div>

                     <div className='row'>
                        <div className={firstColumnClasses}><SmallHeader text='Description' /></div>
                        <div className={secondColumnClasses}>{status.description}</div>
                     </div>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Statuses;