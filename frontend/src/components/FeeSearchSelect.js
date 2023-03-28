import { useState, useEffect } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useFeesContext } from '../hooks/useFeesContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import SmallHeader from './SmallHeader';
import XButton from './XButton';

// functions
import { formatCurrency } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';
import CurrencyInput from './CurrencyInput';

const FeeSearchSelect = ({ billing, setJob }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const { fees, dispatch } = useFeesContext();
    const { user } = useAuthContext();

    const hasAddedFees = billing.length > 0;

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/fees', { headers: { 'Authentication': `Bearer ${user.token}` } });

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
    }, [dispatch, user]);

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
                                billing: [...prev.billing, { fee: doc }]
                            }
                        });
                    };
                }}
                getListedItemText={doc => doc.name}
                filterSuggestions={(fee, text) => fee.name.toLowerCase().includes(text.toLowerCase())}
                inputError={null}
                inputErrorMessage={''}
                documents={fees?.filter(fee => billing.every(bill => fee._id !== bill.fee._id)) ?? []}
                errorLoading={error}
                isLoading={isLoading} />

            {hasAddedFees &&
                <div className='mt-2 d-flex flex-column gap-1'>

                    {/* display the total amount of fees listed, and notation with dagger symbol */}
                    <div className='d-flex align-items-baseline'>
                        <SmallHeader text={`Billing (${billing.length})`} />
                        <small className='text-secondary smallPrint ms-2'>&#8224; adjusted amount</small>
                    </div>

                    <ul className='list-group flex-grow-1 d-flex flex-column gap-1 overflow-scroll' style={{ maxHeight: '350px' }}>

                        {/* when a fee is selected, it creates a list item that gives the user an option to clear it (removes from selected fee list) or enter an adjusted amount to use instead of the base fee amount */}

                        {billing.map(bill => {
                            const { adjustedAmount, fee } = bill;
                            const { _id, amount, name } = fee;

                            return (
                                <li key={_id}>
                                    <div
                                        className='rounded ps-3 pe-0 py-1 border d-flex align-items-center'
                                        style={{ backgroundColor: 'var(--bs-gray-100)' }}
                                    >
                                        <div className='text-reset flex-grow-1 lh-1'>

                                            {/* name of the fee */}
                                            <small className='smallPrint' style={{ opacity: '.65' }}>{name}</small>

                                            {/* list the adjustedAmount if any, otherwise list the fee's amount */}
                                            <div className='d-flex align-items-center my-1'>
                                                <div className='text-nowrap me-2 flex-grow-1'>{'$ ' + formatCurrency(amount, true)}</div>
                                                <CurrencyInput
                                                    amount={adjustedAmount}
                                                    setCurrency={({ input }) => {
                                                        const value = input === '' ? null : input;

                                                        setJob(prev => {
                                                            return ({
                                                                ...prev,
                                                                billing: prev.billing.map(bill => {
                                                                    if (bill.fee._id === _id) return ({ fee: { ...bill.fee }, adjustedAmount: value });
                                                                    return bill;
                                                                })
                                                            })
                                                        }
                                                        )
                                                    }}
                                                />
                                                <span className='smallPrint text-secondary align-self-start ms-1'>&#8224;</span>
                                            </div>
                                        </div>
                                        <div className='text-action'><XButton handleOnClick={() => {
                                            setJob(prev => {
                                                return {
                                                    ...prev,
                                                    billing: billing.filter(bill => bill.fee._id !== _id)
                                                }
                                            });
                                        }} /></div>
                                    </div >
                                </li>
                            );
                        })}
                    </ul>
                    <div className='mt-1 mb-3'>
                        <SmallHeader text='Total' />
                        <span className='ms-3'>{'$ ' + formatCurrency(billing.reduce((total, bill) => addTwoCurrencies(total, (bill.adjustedAmount === null ? bill.fee.amount : bill.adjustedAmount)), 0), true)}</span>
                    </div>
                </div>}
        </>
    );
};

export default FeeSearchSelect;