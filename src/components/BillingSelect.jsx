import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Select, { components } from 'react-select';

// hooks
import { useGetFees } from '../hooks/useGetFees';
import { useFeesContext } from '../hooks/useFeesContext';

// components
import ErrorAlert from './ErrorAlert';
import CurrencyInput from './CurrencyInput';
import SmallHeader from './SmallHeader';

// utilities
import { formatToCurrencyString, removeCommasFromString } from '../utils/StringUtils';
import { billingTotal } from '../utils/NumberUtils';

// container of the options list when the select menu drops down
const Option = (props) => {
   const { amount, name } = props.data.value.fee;
   const currency = formatToCurrencyString({ amount, setTwoDecimalPlaces: true });

   // add classes to the option container
   props.innerProps.className += ' d-sm-flex justify-content-between';

   return (
      <components.Option {...props}>
         <div className='text-wrap'>{name}</div>
         <div className='text-nowrap text-end'>{`$ ${currency}`}</div>
      </components.Option>
   );
};

// container of the item once it's been selected
const MultiValueContainer = (props) => {
   const { handle_onClick_onTouchEnd, isEditing } = props.data.value;
   const editButtonClasses = `bg-none border-0 fs-smaller text-secondary p-2${isEditing() ? ' d-none' : ''}`;

   return (
      <components.MultiValueContainer {...props}>
         <button
            className={editButtonClasses}
            disabled={isEditing()}
            onClick={handle_onClick_onTouchEnd}
            onTouchEnd={handle_onClick_onTouchEnd}
            type='button'
         >
            <i className='bi bi-pen'></i>
         </button>
         {props.children}
      </components.MultiValueContainer>
   )
};

// label element of the multiValue always displays the name of the fee chosen
// the amount on the right is the current amount
// the struck-through amount on the left only appears if the original fee amount has been overridden by the bill overrideAmount
const MultiValueLabel = (props) => {
   const { fee, isEditing, overrideAmount } = props.data.value;
   const hasOverride = !!overrideAmount;
   const originalCurrency = formatToCurrencyString({ amount: fee.amount, setTwoDecimalPlaces: true });
   const overrideCurrency = formatToCurrencyString({ amount: overrideAmount ?? 0, setTwoDecimalPlaces: true });

   // classes for the conditional display of an override amount
   const overrideClasses = `text-decoration-line-through text-secondary opacity-50 me-2${hasOverride ? '' : ' d-none'}`;

   // add classes to the container
   props.innerProps.className += ` d-sm-flex justify-content-between align-items-center py-2${isEditing() ? ' ps-3' : ''}`;

   return (
      <components.MultiValueLabel {...props}>
         <div className='text-wrap'>{fee.name}</div>
         <div className='text-end'>
            <span className={overrideClasses}>{originalCurrency}</span>
            <span>{`$ ${hasOverride ? overrideCurrency : originalCurrency}`}</span>
         </div>
      </components.MultiValueLabel>
   );
};

// sets the billing for the job
// uses custom options and multiValue elements
const BillingSelect = ({ billing, setBilling }) => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees } = useFeesContext();

   const [selectedBill, setSelectedBill] = useState(null);

   const clearSelectedBill = () => setSelectedBill(null);

   const menuOptions = [];
   const multiValuesSelected = [];

   // loop through every fee, seperate fees depending if they're already in the billing
   // billing are all the selected fees
   // options are the fees yet to be selected
   for (let index = 0; index < fees.length; index++) {
      const fee = fees[index];
      const { _id, amount, name } = fee;
      const label = `${name.toLowerCase()} ${amount.toFixed(2)}`;

      let bill;

      // billing and selected fees must be the same length
      // as long as they're not, keep searching for a matching bill
      if (multiValuesSelected.length !== billing.length) {
         bill = billing.find(bill => bill.fee._id === _id);
      };

      // the handle and edit functions are for the custom select components
      if (bill) {
         multiValuesSelected.push({
            label,
            value: {
               ...bill,
               handle_onClick_onTouchEnd: () => setSelectedBill(bill),
               isEditing: () => !!selectedBill,
            }
         });

         continue;
      };

      menuOptions.push({
         label,
         value: {
            fee,
            overrideAmount: null
         }
      });
   };

   // fires when the user is inputting a new amount to override the original fee amount
   const handleConfirmOverrideAmount = () => {
      const updatedBilling = [...billing];

      for (let index = 0; index < updatedBilling.length; index++) {
         const bill = updatedBilling[index];

         if (bill.fee._id === selectedBill.fee._id) {
            updatedBilling[index] = {
               ...bill,
               overrideAmount: Number(removeCommasFromString(selectedBill.overrideAmount))
            }
            break;
         };
      };

      setSelectedBill(null);
      setBilling(updatedBilling);
   };


   // gets a collection of the selected options
   const handleOnChangeSelect = (selectedOptions) => {
      setBilling(selectedOptions.map(selectedOption => ({
         fee: selectedOption.value.fee,
         overrideAmount: selectedOption.value.overrideAmount
      })));
   };

   const handleOnOverrideAmountInput = (input) => {
      setSelectedBill({
         ...selectedBill,
         overrideAmount: input
      });
   };

   // custom filter function that determines if an option should be listed in the drop down menu
   const filterOption = (option, inputText) => {
      if (inputText) {
         // return the option if input is included the label (fee.name fee.amount)
         if (option.label.includes(inputText.toLowerCase())) return true;

         return false;
      };

      // no input returns all fees that have not been selected
      return true;
   };

   // styles for the select container and its children
   const feeSelectStyles = {
      valueContainer: (base) => ({
         ...base,
         flexDirection: 'column',
         flexWrap: 'no-wrap',
         gap: '0.5rem'
      }),
      input: (base) => ({
         ...base,
         minWidth: '100px'
      }),
      multiValue: (base) => ({
         ...base,
         backgroundColor: 'var(--bs-gray-100)',
         borderRight: '1px solid var(--bs-gray-400)',
         borderBottom: '1px solid var(--bs-gray-400)',
         width: '100%'
      }),
      multiValueLabel: (base) => ({
         ...base,
         color: 'var(--mainPalette1)',
         flexGrow: 1
      }),
      multiValueRemove: (base) => ({
         ...base,
         color: 'red',
         transition: 'all 0.2s ease-in-out'
      })
   };

   // only on initial mount, fetch fees
   useEffect(() => {
      getFees();
   }, []);

   if (error) {
      return <ErrorAlert message={error.message} />;
   };

   return (
      <>
         {
            selectedBill &&
            <div className='container-fluid p-0 mb-3'>
               <p className='fs-smaller text-secondary whiteSpace-preWrap mb-3'>
                  {`The new amount will override the fee's original amount for this billing only. It's only saved when you click on the check.`}
               </p>
               <div className='ps-sm-5 mb-1' style={{ fontWeight: '500' }}><SmallHeader text={selectedBill.name} /></div>
               <div className='row'>

                  <div className='col-sm-4 d-flex justify-content-start justify-content-sm-end align-items-center  text-secondary'>
                     <SmallHeader text='New Amount' />
                  </div>
                  <div className='col-sm-8 d-flex align-items-center gap-1'>

                     {/* CONFIRM OVERRIDE AMOUNT */}
                     <motion.i
                        className='bi bi-check2 rounded-1 cursor-pointer py-2 px-sm-2'
                        initial={{ color: 'var(--bs-secondary)' }}
                        onClick={handleConfirmOverrideAmount}
                        role='button'
                        whileHover={{
                           backgroundColor: '#b1fbb3',
                           color: 'var(--bs-success)'
                        }}
                     >

                     </motion.i>

                     <div className='flex-grow-1'>
                        <CurrencyInput input={selectedBill.overrideAmount?.toString() || ''} setInput={handleOnOverrideAmountInput} />
                     </div>

                     {/* CANCEL OVERRIDE AMOUNT */}
                     <motion.i
                        className='bi bi-x rounded-1 cursor-pointer py-2 px-sm-2'
                        initial={{ color: 'var(--bs-secondary)' }}
                        onClick={clearSelectedBill}
                        role='button'
                        whileHover={{
                           backgroundColor: '#FFBDAD',
                           color: 'var(--bs-danger)'
                        }}
                     >
                     </motion.i>
                  </div>
               </div>
            </div>
         }

         <div className='text-end text-secondary pe-2 pe-sm-5 mb-1'>
            <SmallHeader text={`Balance: $ ${formatToCurrencyString({ amount: billingTotal(billing).toString(), setTwoDecimalPlaces: true })}`} />
         </div>

         <Select
            backspaceRemovesValue={false}
            classNamePrefix='mySelectInput'
            closeMenuOnSelect={false}
            components={{
               Option,
               MultiValueContainer,
               MultiValueLabel
            }}
            hideSelectedOptions={true}
            filterOption={filterOption}
            isClearable={false}
            isDisabled={isLoading}
            isLoading={isLoading}
            isMulti
            isSearchable
            loadingMessage={() => 'Loading...'}
            noOptionsMessage={() => 'No results.'}
            onChange={handleOnChangeSelect}
            onMenuOpen={clearSelectedBill}
            openMenuOnFocus={false}
            openMenuOnClick={false}
            options={menuOptions}
            placeholder=''
            styles={feeSelectStyles}
            value={multiValuesSelected}
         />
      </>
   );
};

export default BillingSelect;