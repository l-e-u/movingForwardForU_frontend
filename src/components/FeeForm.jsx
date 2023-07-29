import { useEffect } from 'react';

// functions
import { formatCurrency, removeExtraSpaces } from '../utils/StringUtils';

// components
import GrowingTextArea from './GrowingTextArea';
import FormHeader from './FormHeader';
import CurrencyInput from './CurrencyInput';
import ErrorAlert from './ErrorAlert';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';

const FeeForm = ({
   amount,
   description,
   error,
   handleSubmit,
   isDisabled,
   isLoading,
   name,
   setFee,
}) => {
   // styles for the form
   const formClasses = 'newFeeForm position-relative p-4 pb-5 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '500px' };

   const currencyContainerClasses = 'd-flex rounded-1 p-2';
   const currencyContainerStyles = { border: '1px solid var(--bs-gray-400)' };
   const currencySymbolContainerClasses = 'pe-2';

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles} >

         <FormHeader text='New Fee' />
         <p className='text-secondary text-pre-wrap fs-smaller mb-4'>
            {`Fees make up the billing of a job.\n\nThis amount is the fee's default value. When adding a fee to a job, you have the option to adjust the amount for that job.`}
         </p>

         <div className='container-fluid p-0'>

            {/* AMOUNT */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Amount' />
               </div>
               <div className='col-sm-9'>
                  <div className={currencyContainerClasses} style={currencyContainerStyles}>
                     <span className={currencySymbolContainerClasses}>$</span>
                     <CurrencyInput input={amount} setInput={input => setFee({ description, name, amount: input })} />
                  </div>
               </div>
            </div>

            {/* NAME */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Name' />
               </div>
               <div className='col-sm-9'>
                  <TextInput input={name} setInput={input => setFee({ amount, description, name: input })} />
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Description' />
               </div>
               <div className='col-sm-9'>
                  <GrowingTextArea input={description} setInput={input => setFee({ amount, name, description: input })} />
               </div>
            </div>

         </div>

         {error && <ErrorAlert message={error.message} />}

         <SubmitButton
            defaultText='Save'
            loadingText='Saving'
            isDisabled={isLoading}
            isLoading={isLoading}
         />
      </form>
   );
};

export default FeeForm;