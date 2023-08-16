import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import CreateStatusForm from '../components/CreateStatusForm';
import DeleteForm from '../components/DeleteForm';
import DetailsContainer from '../components/DetailsContainer';
import EditStatusForm from '../components/EditStatusForm';
import EllipsisMenu from '../components/EllipsisMenu';
import SmallHeader from '../components/SmallHeader';

const Statuses = () => {
   const { getStatuses, error, isLoading } = useGetStatuses();
   const { statuses, dispatch } = useStatusesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

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

         <AnimatePresence onExitComplete={() => setSelectedStatus(null)}>
            {
               showEditForm &&
               <EditStatusForm currentStatus={selectedStatus} hideForm={() => setSelectedStatus(null)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedStatus(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='statuses'
                  deleteFromContext={deletedStatus => dispatch({ type: 'DELETE_STATUS', payload: deletedStatus })}
                  documentID={selectedStatus._id}
                  hideForm={() => setShowDeleteForm(false)}
                  modelName='status'
               />
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
                  <motion.li key={status._id} variants={itemVariants} >
                     <DetailsContainer>
                        <EllipsisMenu actions={[
                           {
                              name: 'Edit',
                              icon: 'bi bi-pen',
                              handler: () => {
                                 setSelectedStatus(status);
                                 setShowEditForm(true);
                              }
                           },
                           {
                              name: 'Delete',
                              icon: 'bi bi-trash3',
                              handler: () => {
                                 setSelectedStatus(status);
                                 setShowDeleteForm(true);
                              }
                           }
                        ]}
                        />

                        {/* name */}
                        <div className='row px-2 mb-2'>
                           <div className={firstColumnClasses}>
                              <SmallHeader text='Name' />
                           </div>
                           <div className={secondColumnClasses} style={{ fontWeight: '600' }}>{status.name}</div>
                        </div>

                        {/* description */}
                        <div className='row px-2'>
                           <div className={firstColumnClasses}><SmallHeader text='Description' /></div>
                           <div className={secondColumnClasses + ' whiteSpace-preWrap'}>{status.description}</div>
                        </div>
                     </DetailsContainer>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Statuses;