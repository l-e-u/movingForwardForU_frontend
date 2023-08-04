import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// components
import CreateFeeForm from '../components/CreateFeeForm';
import EditFeeForm from '../components/EditFeeForm';
import SmallHeader from '../components/SmallHeader';

// hooks
import { useGetFees } from '../hooks/useGetFees';
import { useFeesContext } from '../hooks/useFeesContext';

const Fees = () => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees } = useFeesContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [selectedFee, setSelectedFee] = useState(null);

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
   const itemClasses = 'feeItem bg-white container position-relative rounded py-3 px-4';
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
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateFeeForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence>
            {
               selectedFee &&
               <EditFeeForm currentFee={selectedFee} hideForm={() => setSelectedFee(null)} />
            }
         </AnimatePresence>

         {/* button to display the new fee form */}
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
               <i className='bi bi-cash-coin'></i>
            </motion.button>
         </div>

         {/* each item on the list will be staggered as they fade in */}
         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               fees.map(fee => (
                  <motion.li key={fee._id} className={itemClasses} variants={itemVariants} >

                     {/* contains all actions for the document and button to expand the additional info element */}
                     <div className='position-absolute top-0 end-0 pt-1 pe-1'>
                        {/* delete document button */}
                        <motion.button className='rounded me-3' onClick={() => { }} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
                           <i className='bi bi-trash3'></i>
                        </motion.button>

                        {/* edit document button */}
                        <motion.button className='rounded ms-3' onClick={() => setSelectedFee(fee)} type='button' variants={actionButtonVariants} initial='actionButton' whileHover='onHover' >
                           <i className='bi bi-pencil'></i>
                        </motion.button>
                     </div>

                     {/* name */}
                     <div className='row border-bottom border-bottom-xl-0 pb-2 pb-xl-0 mb-2'>
                        <div className='col-xl-2 mt-auto text-secondary text-xl-end'><SmallHeader text='Name' /></div>
                        <div className='col-xl-10 fs-5' style={{ fontWeight: '500' }}>{fee.name}</div>
                     </div>

                     {/* amount */}
                     <div className='row mb-2'>
                        <div className={firstColumnClasses}><SmallHeader text='Amount' /></div>
                        <div className={secondColumnClasses}>{`$ ${fee.amount.toFixed(2)}`}</div>
                     </div>

                     {/* description */}
                     <div className='row'>
                        <div className={firstColumnClasses}><SmallHeader text='Description' /></div>
                        <div className={secondColumnClasses + ' whiteSpace-preWrap'}>{fee.description}</div>
                     </div>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Fees;