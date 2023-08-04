import { useState } from 'react';

// components
import ErrorAlert from './ErrorAlert';
import FeeSelect from './FeeSelect';
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';


const ContactForm = ({
   contact,
   error,
   handleSubmit,
   heading,
   isFetching,
   setContact,
   subHeading,
   submitButtonText,
   submitButtonIsDisabled,
}) => {
   const {
      address,
      billingAddress,
      defaultFees,
      email,
      note,
      name,
      organization,
      phoneExt,
      phoneNumber,
      website,
   } = contact;
   const [selectedTab, setSelectedTab] = useState('Info');
   const tabs = [
      {
         name: 'Info',
         icon: 'bi bi-person-rolodex'
      },
      {
         name: 'Fees',
         icon: 'bi bi-cash-stack'
      },
      {
         name: 'Note',
         icon: 'bi bi-sticky'
      }
   ];

   // styles for the form
   const formClasses = 'newFeeForm position-relative p-4 pb-5 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '700px' };

   // as the user selects fees, the list gets populated
   const defaultFeesListClasses = 'defaultFeesList d-md-flex flex-md-wrap gap-2 rounded m-0 p-0 fs-smaller justify-content-between';
   const defaultFeesListStyles = { listStyle: 'none' };

   // items have the option to clear it off the default-selection list
   const defaultFeesItemClasses = 'd-flex align-items-center rounded-pill mb-2 mb-md-0';
   const defaultFeesItemStyles = {
      border: '1px solid var(--mainPalette4)',
      color: 'var(--mainPalette4)'
   };

   const handleRemoveDefaultFee = (_id) => {
      return () => {
         setContact({
            ...contact,
            defaultFees: defaultFees.filter(fee => _id !== fee._id)
         })
      }
   };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles} >
         <FormHeader text={heading} />
         <p className='text-secondary whiteSpace-preWrap fs-smaller mb-4'>{subHeading}</p>

         <div className='container-fluid p-0'>

            {/* ORGANIZATION */}
            <div className='organization row mb-3'>
               <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Organization' />
               </div>
               <div className='col-sm-9 col-md-10'>
                  <TextInput
                     input={organization}
                     placeholder='Required'
                     setInput={input => setContact({ ...contact, organization: input })}
                  />
               </div>
            </div>

            {/* ADDRESS */}
            <div className='address row mb-3'>
               <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Address' />
               </div>
               <div className='col-sm-9 col-md-10'>
                  <TextInput
                     input={address}
                     placeholder='Required'
                     setInput={input => setContact({ ...contact, address: input })}
                  />
               </div>
            </div>

            {/* TABS AND CONTENT */}
            <div className='tabs d-flex text-secondary fs-smaller mb-3 mt-4'>
               {
                  tabs.map(tab => {
                     const { name, icon } = tab;
                     const isSelected = selectedTab === name;

                     return (
                        <button
                           key={name}
                           className='text-center border-top-0 border-end-0 border-start-0 cursor-pointer flex-grow-1'
                           onClick={() => setSelectedTab(name)}
                           style={{
                              backgroundColor: isSelected ? 'var(--mainPalette9)' : 'transparent',
                              borderBottomWidth: '1px',
                              borderBottomStyle: 'solid',
                              borderBottomColor: isSelected ? 'var(--mainPalette4)' : 'var(--bs-gray-300)',
                              color: isSelected ? 'var(--mainPalette4)' : 'inherit',
                              opacity: isSelected ? '1' : '0.5',
                              transition: 'all 0.2s ease-in-out'
                           }}
                           type='button'
                        >
                           <i className={icon}></i><span className='ms-2'>{name}</span>
                        </button>
                     )
                  })
               }
            </div>

            {/* CONTENT 1: THIS IS DISPLAYED WHEN SELECTING TAB 1: INFO */}
            {
               (selectedTab === tabs[0].name) &&
               <>
                  <div className='billingAddress row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Billing Address' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={billingAddress}
                           setInput={input => setContact({ ...contact, billingAddress: input })}
                        />
                     </div>
                  </div>

                  <div className='email row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Email' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={email}
                           setInput={input => setContact({ ...contact, email: input })}
                           type='email'
                        />
                     </div>
                  </div>

                  <div className='name row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Name' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={name}
                           setInput={input => setContact({ ...contact, name: input })}
                        />
                     </div>
                  </div>

                  <div className='phoneNumber row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Phone' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={phoneNumber}
                           prefixText='+1'
                           setInput={input => setContact({ ...contact, phoneNumber: input })}
                        />
                     </div>
                  </div>

                  <div className='phoneExt row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Ext' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={phoneExt}
                           setInput={input => setContact({ ...contact, phoneExt: input })}
                        />
                     </div>
                  </div>

                  <div className='website row'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Website' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <TextInput
                           input={website}
                           setInput={input => setContact({ ...contact, website: input })}
                        />
                     </div>
                  </div>
               </>
            }

            {/* CONTENT 2: THIS IS DISPLAYED WHEN SELECTING TAB 2: FEES */}
            {
               (selectedTab === tabs[1].name) &&
               <>
                  <p className='fs-smaller text-secondary'>The fees selected here will automatically be added to the billing whenever this contact is selected as a customer on a job.</p>
                  <div className='feeSelect row mb-3'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                        <SmallHeader text='Fee Select' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <FeeSelect selectedFees={defaultFees} setFee={fee => {
                           setContact(prev => ({
                              ...prev,
                              defaultFees: [
                                 ...prev.defaultFees,
                                 fee
                              ]
                           }))
                        }}
                        />
                     </div>
                  </div>

                  {/* DEFAULT FEES */}
                  <div className='defaultFees row'>
                     <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-top text-secondary'>
                        <SmallHeader text='Default Fees' />
                     </div>
                     <div className='col-sm-9 col-md-10'>
                        <ul className={defaultFeesListClasses} style={defaultFeesListStyles}  >
                           {
                              defaultFees.map(fee => (
                                 <li key={fee._id} className={defaultFeesItemClasses} style={defaultFeesItemStyles}>
                                    <span className='px-3'>{fee.name}</span>
                                    <span className='ms-auto'>{`$ ${fee.amount.toFixed(2)}`}</span>
                                    <i className='bi bi-x ps-4 pe-2 py-1' onClick={handleRemoveDefaultFee(fee._id)}></i>
                                 </li>
                              ))
                           }
                        </ul>
                     </div>
                  </div>
               </>
            }

            {/* CONTENT 3: THIS IS DISPLAYED WHEN SELECTING TAB 1: NOTE */}
            {
               (selectedTab === tabs[2].name) &&
               <GrowingTextArea input={note} setInput={input => setContact({ ...contact, note: input })} />
            }

         </div>

         {error && <ErrorAlert message={error.message} />}

         <SubmitButton
            buttonText={submitButtonText}
            isDisabled={submitButtonIsDisabled}
            isSubmittingForm={isFetching}
         />
      </form>
   );
};

export default ContactForm;