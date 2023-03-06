// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import LogInput from './LogInput';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled }) => {
    const { user } = useAuthContext();
    const { status, customer, reference, parcel, drivers, pickup, delivery, logs } = job;

    // error identification on fields with validation
    const errorFromPickupAddressInput = error?.['pickup.address'];
    const errorFromDeliveryAddressInput = error?.['delivery.address'];
    const errorOther = error?.server;

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            {/* STATUS */}
            <StatusSearchSelect
                status={status}
                setJob={setJob}
                inputError={error?.status}
                inputErrorMessage={error?.status?.message} />

            {/* CUSTOMER / CONTACT */}
            <ContactSearchSelect
                customer={customer}
                setJob={setJob}
                inputError={error?.customer}
                inputErrorMessage={error?.customer?.message} />

            {/* REFERENCE */}
            <div className='form-floating mb-2'>
                <input
                    className='form-control'
                    type='text'
                    name='reference'
                    id='reference'
                    placeholder='Reference #'
                    value={reference ?? ''}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                reference: e.target.value
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                reference: removeExtraSpaces(e.target.value.trim())
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
                    value={parcel ?? ''}
                    onChange={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                parcel: e.target.value
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setJob(prev => {
                            return {
                                ...prev,
                                parcel: removeExtraSpaces(e.target.value.trim())
                            }
                        })
                    }} />
                <label htmlFor='parcel' className='form-label'>Parcel</label>
            </div>

            {/* DRIVERS */}
            <DriverSearchSelect drivers={drivers} setJob={setJob} />

            {/* CHECKBOXES TO INCLUDE DATE/TIME FOR PICKUP ADDRESS */}
            <div className='d-flex justify-content-around my-1'>
                <div className='form-check'>
                    <input
                        type='checkbox'
                        className='form-check-input'
                        name='pickupDateCheckbox'
                        id='pickupDateCheckbox'
                        checked={pickup.date ? true : false}
                        onChange={(e) => {
                            const isChecked = e.target.checked;

                            setJob(prev => {
                                return {
                                    ...prev,
                                    pickup: {
                                        ...prev.pickup,
                                        date: isChecked ? new Date() : null,
                                        includeTime: false
                                    }
                                }
                            });
                        }} />
                    <label className='form-check-label' htmlFor='pickupDateCheckbox'>Set Date</label>
                </div>

                {/* USER CANNOT INCLUDE TIME IF THEY HAVE NOT SET A DATE */}
                <div className='form-check'>
                    <input
                        type='checkbox'
                        className='form-check-input'
                        name='pickupTimeCheckbox'
                        id='pickupTimeCheckbox'
                        disabled={pickup.date ? false : true}
                        checked={pickup.includeTime}
                        onChange={e => {
                            const checked = (pickup.date && e.target.checked) || false;

                            setJob(prev => {
                                return {
                                    ...prev,
                                    pickup: {
                                        ...prev.pickup,
                                        includeTime: checked
                                    }
                                }
                            });
                        }} />
                    <label className='form-check-label' htmlFor='pickupTimeCheckbox'>Set Time</label>
                </div>
            </div>

            {pickup.date && <DateInput date={new Date(pickup.date)} setDate={({ day = null, month = null, year = null }) => {
                setJob(prev => {
                    const date = new Date(prev.pickup.date);
                    if (day !== null) date.setDate(day);
                    if (month !== null) date.setMonth(month);
                    if (year !== null) date.setFullYear(year);
                    console.log('date to be saved:', date)
                    return {
                        ...prev,
                        pickup: {
                            ...prev.pickup,
                            date
                        }
                    };
                });
            }} />
            }

            {pickup.includeTime && <TimeInput date={new Date(pickup.date)} setTime={({ hours = null, minutes = null }) => {
                setJob(prev => {
                    const date = new Date(prev.pickup.date);
                    if (hours !== null) date.setHours(hours);
                    if (minutes !== null) date.setMinutes(minutes);

                    return {
                        ...prev,
                        pickup: {
                            ...prev.pickup,
                            date
                        }
                    };
                });
            }} />}

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

            <PickupOrDeliveryInput
                isPickup={true}
                isRequired={true}
                error={error?.['pickup.address']}
                address={pickup.address}
                setAddress={value => {
                    setJob(prev => {
                        return {
                            ...prev,
                            pickup: {
                                ...prev.pickup,
                                address: value
                            }
                        }
                    })
                }} />

            {/* DELIVERY ADDRESS */}
            <div className='form-floating mb-2'>
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

            {/* user can added a list of note with text and optional attachment */}
            <LogInput logs={logs} setJob={setJob} error={error} setError={setError} userId={user._id} />

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>
                Save
            </button>

            {/* any errors other than input validation */}
            {errorOther && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default JobForm;