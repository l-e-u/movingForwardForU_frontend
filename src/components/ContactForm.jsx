// components
import ErrorAlert from './ErrorAlert';
import FeeSelect from './FeeSelect';
import FormHeader from './FormHeader';
import GrowingTextArea from './GrowingTextArea';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import Tabs from './Tabs';
import TextInput from './TextInput';

// utilities
import { feesTotal } from '../utils/NumberUtils';
import { formatToCurrencyString } from '../utils/StringUtils';

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

   return (
      <form
         className='newFeeForm position-relative p-4 pb-5 text-reset shadow bg-white rounded-4'
         onSubmit={handleSubmit}
         style={{ width: '90vw', maxWidth: '700px' }}
      >
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

            {/* BILLING ADDRESS */}
            <div className='address row mb-4'>
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
            <Tabs tabs={[
               {
                  name: 'Info',
                  icon: 'bi bi-person-rolodex',
                  contentJSX: (
                     <>
                        <div className='billingAddress row mb-3'>
                           <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary text-end'>
                              <SmallHeader text='Billing Address' />
                           </div>
                           <div className='col-sm-9 col-md-10'>
                              <TextInput
                                 input={billingAddress}
                                 setInput={input => setContact({ ...contact, billingAddress: input })}
                              />
                           </div>
                        </div>

                        {/* NAME */}
                        <div className='name row mb-3 mb-sm-2'>
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

                        {/* PHONE NUMBER AND EXTENTION */}
                        <div className='phone row mb-3'>
                           <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                              <span className='mt-auto mb-sm-2'>
                                 <SmallHeader text='Phone' />
                              </span>
                           </div>
                           <div className='col-sm-9 col-md-10'>

                              <div className='container-fluid p-0'>
                                 <div className='number ext row'>
                                    <div className='col-8'>
                                       <span className='text-secondary' style={{ opacity: '0.5' }}>
                                          <SmallHeader text='Number' />
                                       </span>
                                       <TextInput
                                          input={phoneNumber}
                                          prefixText='+1'
                                          setInput={input => setContact({ ...contact, phoneNumber: input })}
                                       />
                                    </div>

                                    <div className='col-4'>
                                       <span className='text-secondary' style={{ opacity: '0.5' }}>
                                          <SmallHeader text='Ext' />
                                       </span>
                                       <TextInput
                                          input={phoneExt}
                                          setInput={input => setContact({ ...contact, phoneExt: input })}
                                       />
                                    </div>
                                 </div>
                              </div>

                           </div>
                        </div>

                        {/* EMAIL */}
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

                        {/* WEBSITE */}
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
                  )
               },
               {
                  name: 'Fees',
                  icon: 'bi bi-cash-stack',
                  contentJSX: (
                     <>
                        <p className='fs-smaller text-secondary mb-2'>
                           The fees selected here will automatically be added to the billing whenever this contact is selected as a customer on a job.
                        </p>

                        <div className='text-secondary text-end pe-2 pe-sm-5 mb-1'>
                           <SmallHeader text={`Balance: $ ${formatToCurrencyString({ amount: feesTotal(defaultFees).toString(), setTwoDecimalPlaces: true })}`} />
                        </div>

                        <div className='defaultFeeSelect row mb-3'>
                           <div className='col-sm-3 col-md-2 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                              <SmallHeader text='Default Fees' />
                           </div>

                           <div className='col-sm-9 col-md-10'>
                              <FeeSelect
                                 selectedFees={defaultFees}
                                 setFees={fees => setContact({ ...contact, defaultFees: fees })}
                              />
                           </div>
                        </div>
                     </>
                  )
               },
               {
                  name: 'Note',
                  icon: 'bi bi-sticky',
                  contentJSX: <GrowingTextArea input={note} setInput={input => setContact({ ...contact, note: input })} />
               }
            ]}
            />

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