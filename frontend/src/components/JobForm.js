import { useAuthContext } from '../hooks/useAuthContext';

// components
import ContactDataList from './ContactDataList';
import DriversInput from './DriversInput';
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import SelectedOption from './SelectedOption';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';
import { useStatusesContext } from '../hooks/useStatusesContext';

const JobForm = ({ job, setJob, handleSubmit, error, isDisabled }) => {
    const { user } = useAuthContext();
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

    console.log(job)

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            {/* STATUS */}
            {status ? <SelectedOption text={status.name} handleOnClick={nullPropertyValue('status')} /> : <StatusSearchSelect setJob={setJob} inputError={error} />}

            {/* CUSTOMER / CONTACT */}
            <ContactDataList value={customer?.organization ?? ''} setJob={setJob} error={error} token={token} />

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