import { useEffect } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import Page from '../components/Page';
import SmallHeader from '../components/SmallHeader';

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

   // styling for the horizontal line
   const hrClasses = 'my-1';

   // styling for the list container
   const listClasses = 'contactList d-flex flex-wrap gap-3 p-3 m-0';
   const listStyles = { listStyle: 'none' };

   // styling for an item in the list
   const itemClasses = 'contactItem rounded-3 px-1 pb-1 pt-3 lightGradient';
   const itemStyles = {
      flex: '1 1 500px',
      maxWidth: '1000px'
   };

   // styling for input headers
   const headerStyles = { color: 'var(--mainPalette4)', fontWeight: '500' };

   const listOfContactsJSX = contacts.map(contact => {
      const { _id, organization, name, misc, phoneNumber, phoneExt, email, address, billingAddress, defaultFees } = contact;
      const defaultFeesJSX = defaultFees.map(fee => <span>{fee.name}</span>);

      return (
         <li key={_id} className={itemClasses} style={itemStyles}>
            <div className='container-fluid'>

               <div style={headerStyles}><SmallHeader text='Organization' /></div>
               <div className='fs-3'>{organization}</div>

               <hr className={hrClasses} />

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Address' /></div>
                  <div className='col-sm-10'>{address}</div>
               </div>

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Billing' /></div>
                  <div className='col-sm-10'>{billingAddress}</div>
               </div>

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Name' /></div>
                  <div className='col-sm-10'>{name}</div>
               </div>

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Phone' /></div>
                  <div className='col-sm-10'>{phoneNumber}</div>
               </div>

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Ext' /></div>
                  <div className='col-sm-10'>{phoneExt}</div>
               </div>

               <div className='row mb-2'>
                  <div className='col-sm-2 text-sm-end' style={headerStyles}><SmallHeader text='Email' /></div>
                  <div className='col-sm-10'>{email}</div>
               </div>

               <div className='row rounded-2 py-2' style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                  <div className='text-secondary'><SmallHeader text='Default Fees' /></div>
                  {defaultFeesJSX}
               </div>

               <div className='row rounded-2 py-2 mt-1' style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                  <div className='col-sm-12'>
                     <div className='text-secondary'><SmallHeader text='Miscellaneous' /></div>
                     <div>{misc}</div>
                  </div>
               </div>

            </div>
         </li >
      )
   });

   useEffect(() => {
      getContacts();
   }, []);

   return (
      <Page >
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
         <ul className={listClasses} style={listStyles}>{listOfContactsJSX}</ul>
      </Page>
   );
};

export default Contacts;