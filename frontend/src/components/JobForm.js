import { useEffect } from 'react';

// contexts
import { useAuthContext } from '../hooks/useAuthContext';
import { useGetStatuses } from '../hooks/useGetStatuses';
import { useGetContacts } from '../hooks/useGetContacts';
import { useGetUsers } from '../hooks/useGetUsers';
import { useStatusesContext } from '../hooks/useStatusesContext';
import { useContactsContext } from '../hooks/useContactsContext';

// components
import DriversInput from './DriversInput';
import RequiredFieldsText from './RequiredFieldsText';
import SelectedOption from './SelectedOption';
import AutoCompleteSelect from './AutoCompleteSelect';
import SmallHeader from './SmallHeader';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const JobForm = ({ job, setJob, handleSubmit, error, isDisabled }) => {
    const { getStatuses, error: errorOnGetStatuses, isLoading: isLoadingStatuses } = useGetStatuses();
    const { getContacts, error: errorOnGetContacts, isLoading: isLoadingContacts } = useGetContacts();
    const { getUsers, error: errorOnGetUsers, isLoading: isLoadingUsers } = useGetUsers();
    const { user } = useAuthContext();
    const { statuses } = useStatusesContext();
    const { contacts } = useContactsContext();
    const { token } = user;
    const { status, customer, reference, parcel, drivers, pickup, delivery, logs } = job;

    // error identification on fields with validation
    const errorFromPickupAddressInput = error?.['pickup.address'];
    const errorFromDeliveryAddressInput = error?.['delivery.address'];
    const errorFromLogInput = error?.['logs.note'];
    const errorOther = error?.server;

    // nullifies the proptery on job
    const nullPropertyValue = (property) => {
        return () => {
            setJob(prev => {
                const updated = { ...prev };
                updated[property] = null;
                return updated;
            });
        };
    };

    // sets the property the value will be saved to
    const setPropertyValue = (property) => {
        // sets the value that will be saved
        return (value) => {
            // will save the set value to set property when this function is called
            return () => {
                setJob(prev => {
                    const updated = { ...prev };
                    updated[property] = value;
                    return updated;
                });
            };
        };
    };

    // sets the property the value will be saved to
    const pushValueToProperty = (property) => {
        // sets the value that will be saved
        return (value) => {
            // will push the set value to set property when this function is called
            setJob(prev => {
                const updated = { ...prev };
                updated[property] = [...prev[property], value];
                return updated;
            });
        };
    };

    // on first mount only, get documents
    useEffect(() => {
        (async () => {
            try {
                await getStatuses();
                await getContacts();
                await getUsers();

            } catch (error) {
                console.log('Could not fetch, check your network.')
            };
        })();
    }, []);

    console.log(job)

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            {/* STATUS */}
            {status ?
                <div className='ps-1'>
                    <SmallHeader text='Status' />
                    <SelectedOption text={status.name} handleOnClick={nullPropertyValue('status')} />
                </div> :
                <AutoCompleteSelect
                    text='Status'
                    setJob={setJob}
                    handleOnClickListItem={setPropertyValue('status')}
                    property='status'
                    nestedProperty='name'
                    inputError={error?.status}
                    inputErrorMessage={error?.status?.message}
                    documents={statuses ?? []}
                    errorLoading={errorOnGetStatuses}
                    isLoading={isLoadingStatuses}
                    getDocuments={getStatuses} />}

            {/* CUSTOMER / CONTACT */}
            {customer ?
                <div className='ps-1'>
                    <SmallHeader text='Customer' />
                    <SelectedOption text={customer.organization} handleOnClick={nullPropertyValue('customer')} />
                </div> :
                <AutoCompleteSelect
                    text='Customer'
                    setJob={setJob}
                    handleOnClickListItem={setPropertyValue('customer')}
                    property='customer'
                    nestedProperty='organization'
                    inputError={error?.customer}
                    inputErrorMessage={error?.customer?.message}
                    documents={contacts ?? []}
                    errorLoading={errorOnGetContacts}
                    isLoading={isLoadingContacts}
                    getDocuments={getContacts} />}

            {/* REFERENCE */}
            <div className='form-floating mb-2'>
                <input
                    className='form-control'
                    type='text'
                    name='reference'
                    id='reference'
                    placeholder='Reference #'
                    value={reference}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                reference: removeExtraSpaces(e.target.value)
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                reference: e.target.value.trim()
                            }
                        })
                    }} />
                <label htmlFor='reference' className='form-label'>Reference #</label>
            </div>

            {/* PARCEL */}
            <div className='form-floating mb-2'>
                <input
                    type='text'
                    className='form-control'
                    name='parcel'
                    placeholder='Parcel'
                    id='parcel'
                    value={parcel}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                parcel: removeExtraSpaces(e.target.value)
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                parcel: e.target.value.trim()
                            }
                        })
                    }} />
                <label htmlFor='parcel' className='form-label'>Parcel</label>
            </div>

            {/* DRIVERS */}
            <DriversInput drivers={drivers} setJob={setJob} token={token} />

            {/* PICKUP ADDRESS */}
            <div className='form-floating my-2'>
                <input
                    type='text'
                    className={'form-control' + (errorFromPickupAddressInput ? ' is-invalid' : '')}
                    name='pickupAddress'
                    placeholder='Pickup Address'
                    id='pickupAddress'
                    value={pickup.address}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                pickup: {
                                    ...prev.pickup,
                                    address: removeExtraSpaces(e.target.value)
                                }
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                pickup: {
                                    ...prev.pickup,
                                    address: e.target.value.trim()
                                }
                            }
                        })
                    }} />
                <label htmlFor='pickupAddress' className='form-label required'>
                    Pickup Address
                    {errorFromPickupAddressInput && <span className='inputError'>{error['pickup.address'].message}</span>}
                </label>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className='form-floating'>
                <input
                    type='text'
                    className={'form-control' + (errorFromDeliveryAddressInput ? ' is-invalid' : '')}
                    name='deliveryAddress'
                    placeholder='Delivery Address'
                    id='deliveryAddress'
                    value={delivery.address}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                delivery: {
                                    ...prev.delivery,
                                    address: removeExtraSpaces(e.target.value)
                                }
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                delivery: {
                                    ...prev.delivery,
                                    address: e.target.value.trim()
                                }
                            }
                        })
                    }} />
                <label htmlFor='deliveryAddress' className='form-label required'>
                    Delivery Address
                    {errorFromDeliveryAddressInput && <span className='inputError'>{error['delivery.address'].message}</span>}
                </label>
            </div>

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>
                Create
            </button>

            {/* any errors other than input validation */}
            {errorOther && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default JobForm;