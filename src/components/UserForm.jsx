// components
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import Modal from './Modal';
import TextInput from './TextInput';
import SmallHeader from './SmallHeader';
import ErrorAlert from './ErrorAlert';
import SubmitButton from './SubmitButton';

const UserForm = ({
   error,
   handleSubmit,
   heading,
   hideForm,
   isFetching,
   setUser,
   showActivation,
   submitButtonText,
   submitButtonIsDisabled,
   user,
}) => {
   const { address, firstName, email, isActive, lastName, phoneNumber, note, roles } = user;

   const col1Classes = 'col-sm-2 d-sm-flex justify-content-end align-items-center text-secondary';
   const col2Classes = 'col-sm-10';

   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm}>
         <form onSubmit={handleSubmit}>
            <FormHeader text={heading} />

            {
               showActivation &&
               <p className='fs-smaller text-secondary mt-1 mb-0'>
                  An inactive user will not be able to login despite their permissions and prevents assigning any jobs to them.
                  <br />
                  Useful when wanting to preserve history instead of deleting the user entirely.
               </p>
            }

            <div className='container-fluid p-0 mt-3'>
               {
                  showActivation &&
                  <div className='row mb-2'>
                     <div className={col1Classes}>
                        <label className='form-check-label fs-smaller' htmlFor='activateToggle'>Active</label>
                     </div>

                     <div className={col2Classes}>
                        <div className='form-check form-switch d-flex align-items-center m-0'>
                           <input
                              className='form-check-input'
                              checked={isActive}
                              id='activateToggle'
                              onChange={(e) => setUser({ ...user, isActive: e.target.checked })}
                              name='activateToggle'
                              role='switch'
                              type='checkbox'
                           />
                        </div>
                     </div>
                  </div>
               }

               {/* FIRST & LAST NAME */}
               <div className='names row mb-3'>
                  <div className={col1Classes + ' d-none mt-sm-3'}>
                     <SmallHeader text='Name' />
                  </div>

                  <div className={col2Classes}>
                     <div className='row g-3'>
                        <div className='col-sm-5'>
                           <span className='opacity-100 opacity-sm-50 text-secondary'><SmallHeader text='First' /></span>
                           <TextInput
                              input={firstName}
                              placeholder='Required'
                              setInput={input => setUser({ ...user, firstName: input })}
                           />
                        </div>
                        <div className='col-sm-7'>
                           <span className='opacity-100 opacity-sm-50 text-secondary'><SmallHeader text='Last' /></span>
                           <TextInput
                              input={lastName}
                              placeholder='Required'
                              setInput={input => setUser({ ...user, lastName: input })}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* EMAIL */}
               <div className='email row mb-3'>
                  <div className={col1Classes}>
                     <SmallHeader text='Email' />
                  </div>

                  <div className={col2Classes}>
                     <TextInput
                        input={email}
                        placeholder='Required'
                        setInput={input => setUser({ ...user, email: input })}
                     />
                  </div>
               </div>

               {/* ROLES */}
               <div className='row mb-1'>
                  <div className={col2Classes + ' whiteSpace-preWrap text-secondary fs-smaller mb-2 ms-auto'}>
                     {`Dispatchers have permission to create and edit jobs.\nDrivers can have jobs assigned to them.\nPlease choose at least one.`}
                  </div>
               </div>

               {/* ROLES CHECKBOXES */}
               <div className='roles row mb-2'>
                  <div className={col2Classes + ' d-flex text-secondary fs-smaller ms-auto'}>

                     <div className='form-check me-5'>
                        <input
                           className='form-check-input'
                           checked={roles.includes('dispatcher')}
                           id='dispatcherCheck'
                           name='dispatcherCheck'
                           onChange={e => {
                              const isChecked = e.target.checked;

                              if (isChecked) {
                                 setUser({
                                    ...user,
                                    roles: roles.toSpliced(-1, 0, 'dispatcher')
                                 });

                                 return;
                              };

                              setUser({
                                 ...user,
                                 roles: roles.filter(role => role !== 'dispatcher')
                              })
                           }}
                           type='checkbox'
                        />
                        <label className='form-check-label' htmlFor='dispatcherCheck'>Dispatcher</label>
                     </div>
                     <div className='form-check'>
                        <input
                           className='form-check-input'
                           checked={roles.includes('driver')}
                           id='driverCheck'
                           name='driverCheck'
                           onChange={e => {
                              const isChecked = e.target.checked;

                              if (isChecked) {
                                 setUser({
                                    ...user,
                                    roles: roles.toSpliced(-1, 0, 'driver')
                                 });

                                 return;
                              };

                              setUser({
                                 ...user,
                                 roles: roles.filter(role => role !== 'driver')
                              })
                           }}
                           type='checkbox'
                        />
                        <label className='form-check-label' htmlFor='driverCheck'>Driver</label>
                     </div>

                  </div>
               </div>

               {/* ADDRESS */}
               <div className='address row mb-3'>
                  <div className={col1Classes}>
                     <SmallHeader text='Address' />
                  </div>

                  <div className={col2Classes}>
                     <TextInput
                        input={address}
                        setInput={input => setUser({ ...user, address: input })}
                     />
                  </div>
               </div>

               {/* PHONE NUMBER */}
               <div className='mobile row mb-3'>
                  <div className={col1Classes}>
                     <SmallHeader text='Mobile' />
                  </div>

                  <div className={col2Classes}>
                     <TextInput
                        input={phoneNumber}
                        prefixText='+1'
                        setInput={input => setUser({ ...user, phoneNumber: input })}
                     />
                  </div>
               </div>

               {/* NOTE */}
               <div className='note row'>
                  <div className={col1Classes}>
                     <SmallHeader text='Note' />
                  </div>

                  <div className={col2Classes}>
                     <GrowingTextArea
                        input={note}
                        setInput={input => setUser({ ...user, note: input })}
                     />
                  </div>
               </div>

            </div>

            {error &&
               <div className='mt-2'>
                  <ErrorAlert message={error.message} />
               </div>
            }

            <div className='d-flex justify-content-end mt-3'>
               <SubmitButton
                  buttonText={submitButtonText}
                  buttonType='submit'
                  isDisabled={submitButtonIsDisabled}
                  isSubmittingForm={isFetching}
               />
            </div>
         </form>
      </Modal>
   );
};

export default UserForm;