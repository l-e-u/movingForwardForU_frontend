import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// components
import AddDocumentButton from '../components/AddDocumentButton';
import CreateUserForm from '../components/CreateUserForm';
import DeleteForm from '../components/DeleteForm';
import DetailsContainer from '../components/DetailsContainer';
import EditUserForm from '../components/EditUserForm';
import EllipsisMenu from '../components/EllipsisMenu';
import ErrorAlert from '../components/ErrorAlert';
import LoadingDocuments from '../components/LoadingDocuments';
import SmallHeader from '../components/SmallHeader';

// hooks
import { useUsersContext } from '../hooks/useUsersContext';
import { useGetUsers } from '../hooks/useGetUsers';

// utilities
import { datePrettyString, phoneNumberFormatted } from '../utils/StringUtils';

const Users = () => {
   const { getUsers, error, isLoading } = useGetUsers();
   const { users, dispatch } = useUsersContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [selectedUser, setSelectedUser] = useState(null);

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
         <div className='d-flex my-3 px-3'>
            <AddDocumentButton handleClick={() => setShowCreateForm(true)} />

            {/* Display the total amount of search results */}
            <div className='mt-auto ms-auto text-secondary'>
               <SmallHeader text={`Total: ${users.length}`} />
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
               <CreateUserForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedUser(null)}>
            {
               showEditForm &&
               <EditUserForm currentUser={selectedUser} hideForm={() => setShowEditForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedUser(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='users'
                  deleteFromContext={deletedUser => dispatch({ type: 'DELETE_USER', payload: deletedUser })}
                  documentID={selectedUser._id}
                  hideForm={() => setShowDeleteForm(false)}
                  modelName='user'
                  warning='Alternatively, you may restrict the user from having access by inactivating them.'
               />
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
                  {
                     users.map(user => (
                        <motion.li key={user._id} variants={itemVariants}>
                           <DetailsContainer>
                              <EllipsisMenu
                                 actions={[
                                    {
                                       name: 'Edit',
                                       icon: 'bi bi-pen',
                                       handler: () => {
                                          setSelectedUser(user);
                                          setShowEditForm(true);
                                       }
                                    },
                                    {
                                       name: 'Delete',
                                       icon: 'bi bi-trash3',
                                       handler: () => {
                                          setSelectedUser(user);
                                          setShowDeleteForm(true);
                                       }
                                    },
                                 ]}
                              />

                              {/* active / inactive */}
                              <i className={`bi bi-${user.isActive ? 'person-check' : 'person-x'} fs-smaller me-2 text-secondary`}></i>
                              <span className='text-secondary text-capitalize'>
                                 <SmallHeader
                                    text={user.isActive ?
                                       `Activated: ${datePrettyString({ date: user.createdAt }).split(',')[1].trim()}` :
                                       `Inactivated: ${datePrettyString({ date: user.inactivatedDate }).split(',')[1].trim()}`}
                                 />
                              </span>

                              {/* NAME */}
                              <div className='ms-3 ps-1 my-2' style={{ fontWeight: '600' }}>
                                 {user.fullName}
                                 <i className={`bi bi-patch-${user.isVerified ? 'check' : 'exclamation'} text-secondary fs-smaller ms-2`}></i>
                              </div>

                              <div className='row'>
                                 <div className='col-sm-7 col-lg col-xl'>

                                    {/* CONTACT Details */}
                                    <div className='row g-0 px-3 mx-1'>
                                       <div className='text-secondary' style={{ opacity: '0.5' }}>
                                          <SmallHeader text='Contact' />
                                       </div>

                                       <i className={`bi bi-phone ${col1Classes}`}></i>
                                       <span className={col2Classes} >{phoneNumberFormatted(user.phoneNumber)}</span>

                                       <i className={`bi bi-envelope-at ${col1Classes}`}></i>
                                       <span className={col2Classes + ' word-break-all'}>{user.email}</span>

                                       <i className={`bi bi-geo-alt ${col1Classes}`}></i>
                                       <span className={col2Classes + ' text-capitalize'}>{user.address}</span>
                                    </div>
                                 </div>

                                 <div className='col-sm-5 col-lg col-xl mt-2 mt-sm-0'>
                                    {/* CONTACT Details */}
                                    <div className='row g-0 px-3 mx-1'>
                                       <div className='text-secondary' style={{ opacity: '0.5' }}>
                                          <SmallHeader text='Permissions' />
                                       </div>

                                       {user.roles.includes('dispatcher') &&
                                          <>
                                             <i className={`bi bi-truck ${col1Classes}`}></i>
                                             <span className={col2Classes} >Dispatcher</span>
                                          </>
                                       }

                                       {user.roles.includes('driver') &&
                                          <>
                                             <i className={`bi bi-car-front ${col1Classes}`}></i>
                                             <span className={col2Classes}>Driver</span>
                                          </>
                                       }
                                    </div>
                                 </div>

                                 <div className='col-12 px-4 mx-2 mt-2'>

                                    {/* CONTACT Details */}
                                    <div className='text-secondary' style={{ opacity: '0.5' }}>
                                       <SmallHeader text='Note' />
                                    </div>

                                    <span className={col2Classes} >{user.note}</span>

                                 </div>
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

export default Users;