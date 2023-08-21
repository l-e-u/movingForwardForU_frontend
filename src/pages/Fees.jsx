import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// components
import CreateFeeForm from '../components/CreateFeeForm';
import EditFeeForm from '../components/EditFeeForm';
import SmallHeader from '../components/SmallHeader';

// hooks
import { useGetFees } from '../hooks/useGetFees';
import { useFeesContext } from '../hooks/useFeesContext';
import DetailsContainer from '../components/DetailsContainer';
import EllipsisMenu from '../components/EllipsisMenu';
import DeleteForm from '../components/DeleteForm';
import AddDocumentButton from '../components/AddDocumentButton';
import LoadingDocuments from '../components/LoadingDocuments';

const Fees = () => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees, dispatch } = useFeesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [selectedFee, setSelectedFee] = useState(null);

   // styling for the list container
   const listClasses = 'feeList px-md-5 px-3 py-0 m-0';
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

   // get fees once
   useEffect(() => {
      getFees();
   }, []);

   return (
      <>
         <AddDocumentButton handleClick={() => setShowCreateForm(true)} />

         <AnimatePresence>
            {
               showCreateForm &&
               <CreateFeeForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedFee(null)}>
            {
               showEditForm &&
               <EditFeeForm currentFee={selectedFee} hideForm={() => setShowEditForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedFee(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='fees'
                  deleteFromContext={deletedFee => dispatch({ type: 'DELETE_FEE', payload: deletedFee })}
                  documentID={selectedFee._id}
                  hideForm={() => setShowDeleteForm(false)}
                  modelName='fee'
               />
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
                  {
                     fees.map(fee => (
                        <motion.li key={fee._id} variants={itemVariants} >
                           <DetailsContainer>
                              <EllipsisMenu actions={[
                                 {
                                    name: 'Edit',
                                    icon: 'bi bi-pen',
                                    handler: () => {
                                       setSelectedFee(fee);
                                       setShowEditForm(true);
                                    }
                                 },
                                 {
                                    name: 'Delete',
                                    icon: 'bi bi-trash3',
                                    handler: () => {
                                       setSelectedFee(fee);
                                       setShowDeleteForm(true);
                                    }
                                 },
                              ]}
                              />

                              {/* name */}
                              <div className='row px-2 mb-2'>
                                 <div className={firstColumnClasses}><SmallHeader text='Name' /></div>
                                 <div className={secondColumnClasses} style={{ fontWeight: '600' }}>{fee.name}</div>
                              </div>

                              {/* amount */}
                              <div className='row px-2 mb-2'>
                                 <div className={firstColumnClasses}><SmallHeader text='Amount' /></div>
                                 <div className={secondColumnClasses}>{`$ ${fee.amount.toFixed(2)}`}</div>
                              </div>

                              {/* description */}
                              <div className='row px-2'>
                                 <div className={firstColumnClasses}><SmallHeader text='Description' /></div>
                                 <div className={secondColumnClasses + ' whiteSpace-preWrap'}>{fee.description}</div>
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

export default Fees;