import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import AddDocumentButton from '../components/AddDocumentButton';
import CreateStatusForm from '../components/CreateStatusForm';
import DeleteForm from '../components/DeleteForm';
import DetailsContainer from '../components/DetailsContainer';
import EditStatusForm from '../components/EditStatusForm';
import EllipsisMenu from '../components/EllipsisMenu';
import ErrorAlert from '../components/ErrorAlert';
import LoadingDocuments from '../components/LoadingDocuments';
import SmallHeader from '../components/SmallHeader';

const Statuses = () => {
   const { getStatuses, error, isLoading } = useGetStatuses();
   const { statuses, dispatch } = useStatusesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [selectedStatus, setSelectedStatus] = useState(null);

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
         <div className='d-flex my-3 px-3'>
            <AddDocumentButton handleClick={() => setShowCreateForm(true)} />

            {/* Display the total amount of search results */}
            <div className='mt-auto ms-auto text-secondary'>
               <SmallHeader text={`Total: ${statuses.length}`} />
            </div>
         </div>

         {/* ERROR MESSAGE */}
         {
            error &&
            <div className='mx-3'>
               <ErrorAlert message={error.message} />
            </div>
         }

         <AnimatePresence>
            {
               showCreateForm &&
               <CreateStatusForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedStatus(null)}>
            {
               showEditForm &&
               <EditStatusForm currentStatus={selectedStatus} hideForm={() => setShowEditForm(false)} />
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

         <AnimatePresence mode='wait'>
            {
               !isLoading &&
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
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {isLoading && <LoadingDocuments />}
         </AnimatePresence>
      </>
   );
};

export default Statuses;