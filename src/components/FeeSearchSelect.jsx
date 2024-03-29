import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useFeesContext } from '../hooks/useFeesContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import Counter from './Counter';
import CurrencyInput from './CurrencyInput';
import SmallHeader from './SmallHeader';
import XButton from './XButton';

// functions
import { formatCurrency } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const FeeSearchSelect = ({ billing, setJob }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { fees, dispatch } = useFeesContext();
   const { user } = useAuthContext();

   const billingRef = useRef(null);

   const numOfFees = billing.length;
   const hasAddedFees = numOfFees > 0;

   // referred to the unordered list, scrolls to the bottom when a new fee is added
   const scrollToBottom = () => {
      billingRef.current?.scroll({ top: billingRef.current?.scrollHeight, behavior: 'smooth' });
   };

   // smooth scroll to bottom of the list to bring into view newest fee added
   useEffect(scrollToBottom, [billing]);

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/fees`, { headers: { 'Authentication': `Bearer ${user.token}` } });

         // expecting all fees
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setIsLoading(false);
            setError(json.error);
         };

         if (response.ok) {
            setIsLoading(false);
            setError(false);
            dispatch({ type: 'SET_FEES', payload: json });
         }

      })();
   }, [API_BASE_URL, dispatch, user]);

   return (
      <>
         <AutoCompleteSelect
            labelText='Fees'
            isRequired={false}
            setJob={setJob}
            handleOnClickListItem={doc => {
               return () => {
                  setJob(prev => {
                     return {
                        ...prev,
                        billing: [...prev.billing, { overrideAmount: null, fee: doc }]
                     }
                  });
               };
            }}
            getListedItemText={doc => doc.name}
            filterSuggestions={(fee, text) => fee.name.toLowerCase().includes(text.toLowerCase())}
            inputError={null}
            inputErrorMessage={''}
            documents={fees?.filter(fee => billing.every(bill => fee._id !== bill._id)) ?? []}
            errorLoading={error}
            isLoading={isLoading} />

         {hasAddedFees &&
            <div className='mt-2 d-flex flex-column gap-1'>

               {/* display the total amount of fees listed, and notation with dagger symbol */}
               <div className='d-flex gap-1'>
                  <SmallHeader text='Billing' />
                  {(numOfFees > 1) && <Counter number={numOfFees} />}
                  <small className='text-secondary ms-2'>&#8224; adjusted amount</small>
               </div>

               <ul className='list-group flex-grow-1 d-flex flex-row flex-wrap gap-2 overflow-scroll rounded-0 py-2' ref={billingRef} style={{ maxHeight: '400px', borderTop: '1px solid var(--darkBlue)', borderBottom: '1px solid var(--darkBlue)' }}>

                  {/* when a fee is selected, it creates a list item that gives the user an option to clear it (removes from selected fee list) or enter an adjusted amount to use instead of the base fee amount */}

                  {billing.map(bill => {
                     const { overrideAmount, fee } = bill;
                     const { _id, amount, name } = fee;

                     return (
                        <CSSTransition
                           appear={true}
                           classNames='fade-'
                           in={true}
                           timeout={500}
                           key={_id}
                        >
                           <li style={{ flex: '1 1 250px', maxWidth: '500px' }}>
                              <div
                                 className='rounded ps-3 pe-0 py-1 border d-flex align-items-center'
                                 style={{ backgroundColor: 'var(--bs-gray-100)' }}
                              >
                                 <div className='text-reset flex-grow-1 lh-1'>

                                    {/* name of the fee */}
                                    <small className='smallPrint text-break' style={{ opacity: '.65' }}>{name}</small>


                                    <div className='d-flex align-items-center my-1'>
                                       {/* list the fee's base amount */}
                                       <div className='text-nowrap me-2 flex-grow-1'>{'$ ' + formatCurrency(amount, true)}</div>
                                       {/* input for adjusted amount for the fee */}
                                       <div style={{ maxWidth: '300px' }}>
                                          <CurrencyInput
                                             amount={overrideAmount}
                                             setCurrency={({ input }) => {
                                                setJob(prev => {
                                                   return ({
                                                      ...prev,
                                                      billing: prev.billing.map(bill => {
                                                         if (bill._id === _id) return ({ fee: { ...bill.fee }, overrideAmount: input });
                                                         return bill;
                                                      })
                                                   })
                                                }
                                                )
                                             }}
                                          />
                                       </div>
                                       <span className='smallPrint text-secondary align-self-start ms-1'>&#8224;</span>
                                    </div>
                                 </div>
                                 <div className='text-action'><XButton handleOnClick={() => {
                                    setJob(prev => {
                                       return {
                                          ...prev,
                                          billing: billing.filter(bill => bill._id !== _id)
                                       }
                                    });
                                 }} /></div>
                              </div >
                           </li>
                        </CSSTransition>
                     );
                  })}
               </ul>
               <div className='mt-1 mb-3'>
                  <SmallHeader text='Total' />
                  <span className='ms-3'>{'$ ' + formatCurrency(billing.reduce((total, bill) => addTwoCurrencies(total, (bill.overrideAmount === null ? bill.amount : bill.overrideAmount)), 0), true)}</span>
               </div>
            </div>}
      </>
   );
};

export default FeeSearchSelect;