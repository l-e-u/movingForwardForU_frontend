// components
import GrowingTextArea from './GrowingTextArea';
import CurrencyInput from './CurrencyInput';
import ErrorAlert from './ErrorAlert';
import FormHeader from './FormHeader';
import Modal from './Modal';
import SmallHeader from './SmallHeader';
import SubmitButton from './SubmitButton';
import TextInput from './TextInput';

const FeeForm = ({
   amount,
   description,
   error,
   handleSubmit,
   heading,
   hideForm,
   isFetching,
   name,
   setFee,
   subHeading,
   submitButtonText,
   submitButtonIsDisabled,
}) => {
   return (
      <Modal blurBackdrop={true} canClose={true} closeModal={hideForm} maxWidth='500px'>
         <form onSubmit={handleSubmit}>

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

            <div className='d-flex justify-content-end'>
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

export default FeeForm;