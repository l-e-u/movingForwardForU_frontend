import { useEffect } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import SmallHeader from '../components/SmallHeader';

// utilities
import { phoneNumberFormatted } from '../utils/StringUtils';

const Contacts = () => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts } = useContactsContext();

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
   const itemClasses = 'feeItem bg-white container rounded p-3';
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
   const firstColumnClasses = 'col-sm-3 text-secondary text-sm-end';
   const firstColumnStyles = { fontWeight: '500' }

   const secondColumnClasses = 'col-sm-9'

   useEffect(() => {
      getContacts();
   }, []);

   return (
      < >
         {/* <CreateFeeForm hideForm={() => setShowCreateForm(false)} showForm={showCreateForm} /> */}

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
               contacts.map(contact => (
                  <motion.li key={contact._id} className={itemClasses} variants={itemVariants} >
                     <div className='row mb-2'>
                        <div className={firstColumnClasses + ' mt-auto'}><SmallHeader text='Organization' /></div>
                        <div className={secondColumnClasses + ' fs-5'} style={firstColumnStyles}>{contact.organization}</div>
                     </div>

                     <div className='row mb-2'>
                        <div className={firstColumnClasses}><SmallHeader text='Address' /></div>
                        <div className={secondColumnClasses}>{contact.address}</div>
                     </div>

                     <div className='row mb-2'>
                        <div className={firstColumnClasses}><SmallHeader text='Phone' /></div>
                        <div className={secondColumnClasses}>{phoneNumberFormatted(contact.phoneNumber)}</div>
                     </div>

                     <div className='row mb-2'>
                        <div className={firstColumnClasses}><SmallHeader text='Ext' /></div>
                        <div className={secondColumnClasses}>{contact.phoneExt}</div>
                     </div>

                     <div className='row'>
                        <div className={firstColumnClasses}><SmallHeader text='Email' /></div>
                        <div className={secondColumnClasses + ' word-break-all'} style={{ whiteSpace: '' }}>{contact.email}</div>
                     </div>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Contacts;