import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Select from 'react-select';

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

const BillingSelect = ({ billing, setBilling }) => {
   const { getFees, error, isLoading } = useGetFees();
   const { fees } = useFeesContext();

   const [selectedBill, setSelectedBill] = useState(null);

   // populates the drop-down menu listing all the fees that have not been selected
   const feeMenuOptions = [];

   // populates the values container that displays all the fees that have been selected
   const billingValues = [];

   const handleCancelOverrideAmount = () => setSelectedBill(null);

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

   // filter all the fees that the user has selected, and format into billing for the job
   const handleOnChange = (selectedOptions) => {
      // regardless of adding or removing a selected fee, clear selectedBill
      setSelectedBill(null);

      // remove the toString function that was added before
      setBilling(selectedOptions.map(selectedOption => {
         const { toString, fee, overrideAmount, ...bill } = selectedOption.value;
         console.log(selectedOption.value)
         return {
            ...bill,
            fee,
            overrideAmount: overrideAmount !== null ? overrideAmount : null
         };
      }));
   };

   // shows currency input to override fee amount
   const handleEditOnClick = (bill) => (() => setSelectedBill(bill));

   const handleOnOverrideAmountInput = (input) => {
      setSelectedBill({
         ...selectedBill,
         overrideAmount: input
      });
   };

   // custom filter function that determines if an option should be listed in the drop down menu
   const filterOption = (option, inputText) => {
      // with user input, compare the input with the name and amount
      if (inputText) {
         const { amount, name } = option.data.value.fee;
         const optionNameAmount = `${name.toLowerCase()} ${amount.toFixed(2)}`;

         // return the option if input is included in either name or amount
         if (optionNameAmount.includes(inputText.toLowerCase())) return true;

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
      option: (base) => ({
         ...base,
      }),
      multiValue: (base) => ({
         ...base,
         backgroundColor: 'var(--bs-gray-100)',
         width: '100%',
      }),
      multiValueLabel: (base) => ({
         ...base,
         color: 'var(--mainPalette1)',
         padding: 0,
         paddingLeft: 0,
         flexGrow: 1,
      }),
      multiValueRemove: (base) => ({
         ...base,
         color: 'var(--bs-secondary)',
         transition: 'all 0.2s ease-in-out'
      })
   };

   // separate the fees into IS / NOT included in billing
   fees.forEach(fee => {
      const { _id, amount, name } = fee;
      const bill = billing.find(bill => bill.fee._id === fee._id);
      const toString = () => _id;
      let amountText = amount >= 0 ? amount.toFixed(2) : `(${amount.toFixed(2)})`;

      // toString function is used as a key for the options to avoid unique-key error for children
      const isIncludedInBilling = !!bill;

      // selected fees are the ones that are included in the job's billing. list these separately as selected values
      if (isIncludedInBilling) {
         const { overrideAmount } = bill;
         const hasOverride = overrideAmount !== null;
         let overrideText;

         if (hasOverride) {
            overrideText = overrideAmount.toFixed(2);
            overrideText = overrideAmount >= 0 ? overrideText : `(${overrideText})`;
         }
         else {
            amountText = '$ ' + amountText;
         };

         return billingValues.push({
            label: (
               <div className='d-flex'>
                  {!selectedBill &&
                     <motion.span
                        className='myOptionEditButton d-flex justify-content-center align-items-center cursor-pointer rounded-1'
                        onClick={handleEditOnClick(bill)}
                        whileHover={{ backgroundColor: 'var(--bs-gray-300)' }}
                     >
                        <i className='bi bi-pencil text-secondary'></i>
                     </motion.span>
                  }

                  <span className=''>{name}</span>
                  <span className={hasOverride ? 'text-decoration-line-through' : ''} style={{ opacity: hasOverride ? '0.5' : '1' }}>
                     {amountText}
                  </span>
                  {hasOverride && <span className=''>{`$ ${overrideText}`}</span>}
               </div>
            ),
            value: {
               ...bill,
               fee: { ...bill.fee },
               toString,
            }
         });
      };

      // these are the fees that have not been selected yet
      feeMenuOptions.push({
         label: (
            <div className='d-flex justify-content-between'>
               <div>{name}</div>
               <div className='text-nowrap'>{`$ ${amountText}`}</div>
            </div>
         ),
         value: {
            fee,
            overrideAmount: null,
            toString
         }
      });
   });

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
                  {`The new amount will override the fee's original amount for this billing only.`}
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
                        onClick={handleCancelOverrideAmount}
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
            hideSelectedOptions={true}
            filterOption={filterOption}
            isClearable={false}
            isDisabled={isLoading}
            isLoading={isLoading}
            isMulti
            isSearchable
            loadingMessage={() => 'Loading...'}
            noOptionsMessage={() => 'No results.'}
            onChange={handleOnChange}
            openMenuOnFocus={false}
            openMenuOnClick={false}
            options={feeMenuOptions}
            placeholder=''
            styles={feeSelectStyles}
            value={billingValues}
         />
      </>
   );
};

export default BillingSelect;