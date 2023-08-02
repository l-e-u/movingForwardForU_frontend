import { useEffect } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import ContactDetails from '../components/ContactDetails';


const Contacts = () => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts } = useContactsContext();

   // styling for the list container
   const listClasses = 'contacts pt-3 px-3 pb-0 px-md-5';
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
            staggerChildren: .5,
            marginBottom: { delay: 0.5 }
         }
      }
   };

   useEffect(() => {
      getContacts();
   }, []);

   return (
      <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
         {
            contacts.map(contact => (
               <motion.li key={contact._id} variants={itemVariants} >
                  <ContactDetails contact={contact} />
               </motion.li>
            ))
         }
      </motion.ul>
   );
};

export default Contacts;