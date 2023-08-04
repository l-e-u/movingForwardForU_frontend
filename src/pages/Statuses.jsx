import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import CreateStatusForm from '../components/CreateStatusForm';
import EditStatusForm from '../components/EditStatusForm';
import SmallHeader from '../components/SmallHeader';

const Statuses = () => {
   const { getStatuses, error, isLoading } = useGetStatuses();
   const { statuses } = useStatusesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [selectedStatus, setSelectedStatus] = useState(null);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'px-3 py-1 ms-auto position-relative border-0 rounded text-white d-flex justify-content-center align-items-center gap-1';
   const addButtonVariants = {
      mount: {
         backgroundColor: 'var(--mainPalette4)',
      },
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette4)',
      }
   };

   // delete and edit buttons variants
   const actionButtonVariants = {
      actionButton: {
         background: 'transparent',
         borderWidth: '1px',
         borderStyle: 'solid',
         borderColor: 'var(--bs-secondary)',
         color: 'var(--bs-secondary)',
         scale: 1,
         opacity: 0.5
      },
      onHover: {
         borderColor: 'var(--mainPalette4)',
         color: 'var(--mainPalette4)',
         scale: 1.1,
         opacity: 1,
         transition: {
            duration: 0.2,
         }
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
   const itemClasses = 'statusItem bg-white container position-relative rounded py-3 px-4';
   const itemVariants = {
      mount: {
         opacity: 0,
         marginBottom: '0',
      },
      animation: {
         opacity: 1,
         marginBottom: '1rem',
         boxShadow: '0 .125rem .25rem var(--mainPalette8)',
         transition: {
            marginBottom: {
               delay: 0.5
            }
         }
      }
   };

   // styling for the columns
   const firstColumnClasses = 'col-sm-2 text-secondary text-sm-end';
   const secondColumnClasses = 'col-sm-10'

   // get statuses once
   useEffect(() => {
      getStatuses();
   }, []);

   return (
      < >
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateStatusForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence>
            {
               selectedStatus &&
               <EditStatusForm currentStatus={selectedStatus} hideForm={() => setSelectedStatus(null)} />
            }
         </AnimatePresence>

         {/* button to display the new status form */}
         <div className='p-2'>
            <motion.button
               className={addButtonClasses}
               onClick={() => setShowCreateForm(true)}
               type='button'
               variants={addButtonVariants}
               initial='mount'
               whileHover='onHover'
            >
               <i className='bi bi-plus'></i>
               <i className='bi bi-tags'></i>
            </motion.button>
         </div>

         {/* each item on the list will be staggered as they fade in */}

         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               statuses.map(status => (
                  <motion.li key={status._id} className={itemClasses} variants={itemVariants} >

                     {/* contains all actions for the document and button to expand the additional info element */}
                     <div className='position-absolute top-0 end-0 pt-1 pe-1'>
                        {/* delete document button */}
                        <motion.button className='rounded me-3' onClick={() => { }} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
                           <i className='bi bi-trash3'></i>
                        </motion.button>

                        {/* edit document button */}
                        <motion.button className='rounded ms-3' onClick={() => setSelectedStatus(status)} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
                           <i className='bi bi-pencil'></i>
                        </motion.button>
                     </div>

                     {/* name */}
                     <div className='row border-bottom border-bottom-lg-0 pb-2 pb-lg-0 mb-2'>
                        <div className='col-lg-2 mt-auto text-secondary text-lg-end'><SmallHeader text='Name' /></div>
                        <div className='col-lg-10 fs-5' style={{ fontWeight: '500' }}>{status.name}</div>
                     </div>

                     {/* description */}
                     <div className='row'>
                        <div className={firstColumnClasses}><SmallHeader text='Description' /></div>
                        <div className={secondColumnClasses + ' whiteSpace-preWrap'}>{status.description}</div>
                     </div>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Statuses;