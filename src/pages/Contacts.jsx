import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import CreateContactForm from '../components/CreateContactForm';
import ContactDetails from '../components/ContactDetails';
import EditContactForm from '../components/EditContactForm';
import DeleteForm from '../components/DeleteForm';


const Contacts = () => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts, dispatch } = useContactsContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [selectedContact, setSelectedContact] = useState(null);

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
   const listClasses = 'contacts px-3 pb-0 px-md-5';
   const listVariants = {
      mount: {
         listStyle: 'none',
         margin: '0',
         padding: '0'
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
         marginBottom: '0'
      },
      animation: {
         opacity: 1,
         marginBottom: '1rem',
         transition: {
            marginBottom: {
               delay: 0.5
            }
         }
      }
   };

   useEffect(() => {
      getContacts();
   }, []);

   return (
      <>
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateContactForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedContact(null)}>
            {
               showEditForm &&
               <EditContactForm currentContact={selectedContact} hideForm={() => setShowEditForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedContact(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='contacts'
                  deleteFromContext={deletedContact => dispatch({ type: 'DELETE_CONTACT', payload: deletedContact })}
                  documentID={selectedContact._id}
                  hideForm={() => setShowDeleteForm(false)}
                  modelName='contact'
               />
            }
         </AnimatePresence>

         {/* button to display the new contact form */}
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
               <i className='bi bi-person-vcard'></i>
            </motion.button>
         </div>

         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               contacts.map(contact => (
                  <motion.li key={contact._id} variants={itemVariants} >
                     <ContactDetails
                        contact={contact}
                        showDeleteForm={() => {
                           setSelectedContact(contact);
                           setShowDeleteForm(true);
                        }}
                        showEditForm={() => {
                           setSelectedContact(contact);
                           setShowEditForm(true);
                        }}
                     />
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Contacts;