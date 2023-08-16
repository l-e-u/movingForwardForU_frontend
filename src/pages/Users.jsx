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
   const col1Classes = 'col-1 d-flex align-items-center justify-content-start fs-smaller text-secondary py-1 mb-auto';
   const col2Classes = 'col-11';

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

                        {/* active / inactive */}
                        <i className={`bi bi-${user.isActive ? 'person-check' : 'person-x'} fs-smaller me-2 text-secondary`}></i>
                        <span className='text-secondary'><SmallHeader text={user.isActive ? 'Active' : 'Inactive'} /></span>

                        <br />

                        <i className='bi bi-person-lock fs-smaller me-2 text-secondary'></i>
                        <span className='text-secondary text-capitalize'><SmallHeader text={user.roles.join(', ')} /></span>

                        {/* NAME */}
                        <div className='ms-3 ps-1 my-2' style={{ fontWeight: '600' }}>
                           {user.fullName}
                        </div>

                        <div className='row g-0 px-3 mx-1'>
                           <div className='text-secondary' style={{ opacity: '0.5' }}>
                              <SmallHeader text='Contact' />
                           </div>

                           <i className={`bi bi-phone ${col1Classes}`}></i>
                           <span className={col2Classes} >{user.phoneNumber}</span>

                           <i className={`bi bi-envelope-at ${col1Classes}`}></i>
                           <span className={col2Classes + ' word-break-all'}>{user.email}</span>

                           <i className={`bi bi-geo-alt ${col1Classes}`}></i>
                           <span className={col2Classes + ' text-capitalize'}>{user.address}</span>
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