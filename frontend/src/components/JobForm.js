// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import LogInput from './LogInput';

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
                    value={parcel ?? ''}
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
            <DriverSearchSelect drivers={drivers} setJob={setJob} />

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

            <LogInput logs={logs} setJob={setJob} error={error} setError={setError} />

            <button
                type='button'
                className='btn btn-sm btn-primary rounded-pill px-3 d-flex mt-2 mx-auto'
                onClick={() => {
                    setJob(prev => {
                        return {
                            ...prev,
                            logs: [...prev.logs, { note: '', createdBy: user._id }]
                        }
                    })
                }}>
                Add A Note
            </button>

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