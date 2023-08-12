import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// components
import CreateUserForm from '../components/CreateUserForm';
import DetailsContainer from '../components/DetailsContainer';
import EllipsisMenu from '../components/EllipsisMenu';
import SmallHeader from '../components/SmallHeader';

// hooks
import { useUsersContext } from '../hooks/useUsersContext';
import { useGetUsers } from '../hooks/useGetUsers';

const Users = () => {
   const { getUsers, error, isLoading } = useGetUsers();
   const { users } = useUsersContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'px-3 py-1 ms-auto position-relative border-start-0 border-top-0 rounded text-white d-flex justify-content-center align-items-center gap-1';
   const addButtonVariants = {
      mount: {
         backgroundColor: 'var(--mainPalette4)',
         borderRight: '1px solid var(--mainPalette2)',
         borderBottom: '1px solid var(--mainPalette2)'
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
   const listClasses = 'jobsList px-3 pb-0 px-md-5';
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

   // styling for the columns
   const firstColumnClasses = 'col-sm-2 text-secondary text-sm-end';
   const secondColumnClasses = 'col-sm-10'

   useEffect(() => {
      getUsers();
   }, []);

   return (
      <>
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateUserForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         {/* button to display the new job form */}
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
               <i className='bi bi-truck'></i>
            </motion.button>
         </div>

         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               users.map(user => (
                  <motion.li key={user._id} variants={itemVariants}>
                     <DetailsContainer>
                        <EllipsisMenu
                           actions={[
                              {
                                 name: 'Delete',
                                 icon: 'bi bi-trash3',
                                 handler: () => { }
                              },
                              {
                                 name: 'Edit',
                                 icon: 'bi bi-pen',
                                 handler: () => selectedUser(user)
                              }
                           ]}
                        />


                        {/* NAME */}
                        <div className='mb-2' style={{ fontWeight: '600' }}>{user.fullName}</div>

                        {/* NOTE */}
                        <div className='row px-1 px-sm-3 px-md-4 px-lg-1'>
                           {/* PHONE */}
                           <div className='phone col-lg d-flex gap-2 justify-content-lg-center align-items-center mb-1 mb-lg-0'>
                              <i className='bi bi-telephone text-secondary fs-smaller'></i>
                              <div>
                                 {`${user.phoneNumber ? phoneNumberFormatted(user.phoneNumber) : ''}`}
                              </div>
                           </div>

                           {/* EMAIL */}
                           <div className='email col-lg d-flex gap-2 justify-content-lg-center align-items-center'>
                              <i className='bi bi-envelope-at text-secondary fs-smaller'></i>
                              <div className='word-break-all'>{user.email}</div>
                              {user.isVerified && <i className='bi bi-patch-check text-secondary fs-smaller'></i>}
                           </div>

                           {/* NOTE */}
                           <div className='address col-lg d-flex gap-2 justify-content-lg-center align-items-center mb-1 mb-lg-0'>
                              <i className='bi bi-sticky text-secondary fs-smaller'></i>
                              <div>{user.note}</div>
                           </div>
                        </div>

                     </DetailsContainer>
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Users;