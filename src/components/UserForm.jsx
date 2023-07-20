// functions
import { removeExtraSpaces } from '../utils/StringUtils';

// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';
import ActionButton from './ActionButton'

const UserForm = ({
   error,
   handleSubmit,
   isDisabled,
   isLoading,
   setUser,
   user,
   isEditing = false,
}) => {
   const errorFromEmailInput = error?.path === 'email';
   const errorFromFirstNameInput = error?.path === 'firstName';
   const errorFromLastNameInput = error?.path === 'lastName';

   return (
      <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
         <RequiredFieldsText />

         {/* Option to deactivate a user is only available for the Edit Form */}
         {isEditing && <div className='form-check m-0'>
            <input
               type='checkbox'
               className='form-check-input'
               id='activeCheck'
               checked={user.isActive}
               onChange={() => {
                  setUser(prev => {
                     return {
                        ...prev,
                        isActive: !prev.isActive
                     }
                  })
               }} />
            <label className='form-check-label' htmlFor='activeCheck'>Active</label>
            <br />
            <small className='text-secondary'>Inactive users will not be able to login.</small>
         </div>}

         <div className='form-check m-0'>
            <input
               type='checkbox'
               className='form-check-input'
               id='adminCheck'
               checked={user.isAdmin}
               onChange={() => {
                  setUser(prev => {
                     return {
                        ...prev,
                        isAdmin: !prev.isAdmin
                     }
                  })
               }} />
            <label className='form-check-label' htmlFor='adminCheck'>Administrator</label>
            <br />
            <small className='text-secondary'>A user with administrator privileges will be able to create, edit , and delete all documents. </small>
         </div>

         <div className='d-flex flex-column flex-md-row gap-2'>
            {/* NAME */}
            <div className='form-floating flex-grow-1'>
               <input
                  type='text'
                  className={'form-control' + (errorFromFirstNameInput ? ' is-invalid' : '')}
                  name='firstName'
                  id='firstName'
                  placeholder='First Name'
                  value={user.firstName}
                  onChange={e => {
                     setUser(prev => {
                        return {
                           ...prev,
                           firstName: e.target.value
                        }
                     })
                  }}
                  onBlur={e => {
                     setUser(prev => {
                        return {
                           ...prev,
                           firstName: removeExtraSpaces(e.target.value.trim())
                        }
                     })
                  }} />
               <label htmlFor='firstName' className='form-label required'>
                  {errorFromFirstNameInput ? <span className='inputError'>{error.message}</span> : 'First Name'}
               </label>
            </div>

            <div className='form-floating flex-grow-1'>
               <input
                  type='text'
                  className={'form-control' + (errorFromLastNameInput ? ' is-invalid' : '')}
                  name='lastName'
                  id='lastName'
                  placeholder='Last Name'
                  value={user.lastName}
                  onChange={e => {
                     setUser(prev => {
                        return {
                           ...prev,
                           lastName: e.target.value
                        }
                     })
                  }}
                  onBlur={e => {
                     setUser(prev => {
                        return {
                           ...prev,
                           lastName: removeExtraSpaces(e.target.value.trim())
                        }
                     })
                  }} />
               <label htmlFor='lastName' className='form-label required'>
                  {errorFromLastNameInput ? <span className='inputError'>{error.message}</span> : 'Last Name'}
               </label>
            </div>
         </div>

         <div className='d-flex flex-column flex-md-row gap-2'>

            {/* EMAIL */}
            <div className='form-floating flex-grow-1'>
               <input
                  type='email'
                  className={'form-control' + (errorFromEmailInput ? ' is-invalid' : '')}
                  id='email'
                  placeholder='name@example.com'
                  value={user.email}
                  onChange={(e) => {
                     setUser(prev => {
                        return {
                           ...prev,
                           email: e.target.value
                        }
                     })
                  }}
                  onBlur={(e) => {
                     setUser(prev => {
                        return {
                           ...prev,
                           email: removeExtraSpaces(e.target.value.trim())
                        }
                     })
                  }} />
               <label htmlFor='email' className='form-label required'>
                  {errorFromEmailInput ? <span className='inputError'>{error.message}</span> : 'Email'}
               </label>
            </div>

            {/* ADDRESS */}
            <div className='form-floating flex-grow-1'>
               <input
                  type='text'
                  className='form-control'
                  name='address'
                  placeholder='Address'
                  id='address'
                  value={user.address ?? ''}
                  onChange={(e) => {
                     setUser(prev => {
                        return {
                           ...prev,
                           address: removeExtraSpaces(e.target.value)
                        }
                     })
                  }}
                  onBlur={(e) => {
                     setUser(prev => {
                        return {
                           ...prev,
                           address: e.target.value.trim()
                        }
                     })
                  }} />
               <label htmlFor='address' className='form-label'>Address</label>
            </div>
         </div>

         {/* COMMENTS */}
         <div className='form-floating'>
            <GrowingTextArea
               className='form-control'
               name='commentsTextarea'
               onChange={e => setUser(prev => {
                  return { ...prev, comments: e.target.value };
               })}
               placeholder='Comments'
               value={user.comments}
            />
            <label htmlFor='commentsTextarea' className='form-label'>Comments</label>
         </div>

         {(isLoading && !isEditing) && <div className='alert alert-success py-1 m-0'>Sending email to user...</div>}

         <ActionButton
            alignX='right'
            text={(isLoading ? 'Saving...' : 'Save')}
            type='submit'
            isDisabled={isDisabled}
         />
      </form>
   );
};

export default UserForm;