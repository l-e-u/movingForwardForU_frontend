// components
import GrowingTextArea from './GrowingTextArea';
import CurrencyInput from './CurrencyInput';
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';

const FeeForm = ({
   amount,
   description,
   error,
   handleSubmit,
   heading,
   isFetching,
   name,
   setFee,
   subHeading,
   submitButtonText,
   submitButtonIsDisabled,
}) => {
   // styles for the form
   const formClasses = 'newFeeForm position-relative p-4 pb-5 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '500px' };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles} >

         <FormHeader text={heading} />
         <p className='text-secondary whiteSpace-preWrap fs-smaller mb-4'>{subHeading}</p>

         <div className='container-fluid p-0'>
            {/* AMOUNT */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Amount' />
               </div>
               <div className='col-sm-9'>
                  <CurrencyInput input={amount} setInput={input => setFee({ description, name, amount: input })} />
               </div>
            </div>

            {/* NAME */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Name' />
               </div>
               <div className='col-sm-9'>
                  <TextInput input={name} setInput={input => setFee({ amount, description, name: input })} />
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center text-secondary'>
                  <SmallHeader text='Description' />
               </div>
               <div className='col-sm-9'>
                  <GrowingTextArea input={description} setInput={input => setFee({ amount, name, description: input })} />
               </div>
            </div>

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

export default FeeForm;