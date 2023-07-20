import { useEffect } from 'react';

// functions
import { formatCurrency, removeExtraSpaces } from '../utils/StringUtils';

// components
import GrowingTextArea from './GrowingTextArea';
import RequiredFieldsText from './RequiredFieldsText';
import ActionButton from './ActionButton'
import CurrencyInput from './CurrencyInput';

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
   const errorFeeNameInput = error?.path?.toLowerCase() === 'name';
   const errorFeeDescriptionInput = error?.path?.toLowerCase() === 'description';
   const errorAmountInput = error?.path?.toLowerCase() === 'amount';

   // validate that the input represents a currency
   useEffect(() => {
      setFee(prev => {
         return { ...prev, amount: formatCurrency(amount) }
      });
   }, [amount, setFee]);

   const handleOnChange = (value) => {
      setFee(prev => {
         return { ...prev, ...value };
      });
   };

   return (
      <form className='d-flex flex-column gap-2' onSubmit={e => {
         e.preventDefault();

         handleSubmit();
      }}
      >
         <RequiredFieldsText />

         <div className='d-flex flex-column flex-md-row gap-2 gap-md-3'>
            <div className='form-floating w-md-75'>
               <input
                  className={'form-control' + (errorFeeNameInput ? ' is-invalid' : '')}
                  id='name'
                  name='name'
                  onBlur={e => handleOnChange({ name: removeExtraSpaces(e.target.value.trim()) })}
                  onChange={e => handleOnChange({ name: e.target.value })}
                  placeholder='Name'
                  type='text'
                  value={name}
               />
               <label htmlFor='name' className='form-label required'>
                  {errorFeeNameInput ? <span className='ms-1 text-danger'>{error.message}</span> : 'Name'}
               </label>
            </div>

            <div className='w-md-25 rounded' style={{ height: '58px' }}>
               <CurrencyInput
                  amount={amount}
                  inputError={errorAmountInput && error}
                  setCurrency={({ input }) => handleOnChange({ amount: input })}
               />
            </div>

         </div>
         <div className='form-floating'>
            <GrowingTextArea
               className={'form-control' + (errorFeeDescriptionInput ? ' is-invalid' : '')}
               id='description'
               name='description'
               onBlur={e => handleOnChange({ description: e.target.value.trim() })}
               onChange={e => handleOnChange({ description: e.target.value })}
               placeholder='Description'
               type='text'
               value={description}
            />
            <label htmlFor='description' className='form-label required'>
               {errorFeeDescriptionInput ? <span className='ms-1 text-danger'>{error.message}</span> : 'Description'}
            </label>
         </div>

         <ActionButton
            alignX='right'
            text={(isLoading ? 'Saving...' : 'Save')}
            type='submit'
            isDisabled={isDisabled}
         />
      </form>
   )
};

export default FeeForm;