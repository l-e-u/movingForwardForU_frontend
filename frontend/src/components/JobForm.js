import { useState } from 'react';

// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';
import NotesInput from './NotesInput';
import FeeSearchSelect from './FeeSearchSelect';
import ActionButton from './ActionButton'

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled, isLoading }) => {
    const { status, customer, billing, mileage, reference, parcel, drivers, notes } = job;

    const [isResizingImages, setIsResizingImages] = useState(false);

    const errorOther = error?.server;

    return (<>
        <RequiredFieldsText />
        <form onSubmit={handleSubmit}>
            <div className='d-xl-flex gap-3'>
                {/* status, customer, ref, parcel, drivers */}
                <div className='d-md-flex flex-grow-1 gap-3 mb-3 mb-xl-0'>
                    <div className='d-flex flex-column justify-content-between gap-2 w-md-50 mb-3 mb-md-0' >
                        {/* STATUS */}
                        <StatusSearchSelect
                            status={status}
                            setJob={setJob}
                            inputError={error?.status}
                            inputErrorMessage={error?.status?.message}
                        />

                        {/* CUSTOMER / CONTACT */}
                        <ContactSearchSelect
                            customer={customer}
                            setJob={setJob}
                            inputError={error?.customer}
                            inputErrorMessage={error?.customer?.message}
                        />

                        {/* REFERENCE */}
                        <div className='form-floating'>
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
                        <div className='form-floating'>
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

                        {/* MILEAGE */}
                        <div className='form-floating'>
                            <input
                                className={'form-control' + (error?.mileage ? ' is-invalid' : '')}
                                id='mileage'
                                name='mileage'
                                onBlur={e => {
                                    const input = e.target.value;

                                    if (input === '') {
                                        setJob(prev => {
                                            return {
                                                ...prev,
                                                mileage: 0
                                            }
                                        })
                                    }
                                }}
                                onChange={e => setJob(prev => {
                                    return {
                                        ...prev,
                                        mileage: e.target.value
                                    }
                                })}
                                placeholder='Mileage'
                                step={1}
                                title='Needs to be a number.'
                                type='number'
                                value={mileage}
                            />
                            <label htmlFor='mileage' className='form-label'>
                                Mileage
                                {error?.mileage && <span className='ms-1 text-danger'>{': ' + error.mileage.message}</span>}
                            </label>
                        </div>

                        {/* DRIVERS */}
                        <DriverSearchSelect drivers={drivers} setJob={setJob} />
                    </div>

                    {/* pickup delivery details */}
                    <div className='d-flex flex-column justify-content-between gap-3 w-md-50'>
                        {/* PICKUP ADDRESS/TIME */}
                        <PickupOrDeliveryInput
                            isPickup={true}
                            error={error?.['pickup.address']}
                            job={job}
                            setJob={setJob}
                        />

                        {/* DELIVERY ADDRESS/TIME */}
                        <PickupOrDeliveryInput
                            isPickup={false}
                            error={error?.['delivery.address']}
                            job={job}
                            setJob={setJob}
                        />
                    </div>
                </div>

                <div className='d-md-flex flex-grow-1 gap-3 mb-md-3 mb-xl-0'>
                    {/* billing */}
                    <div className='w-md-50 order-md-1'>
                        <FeeSearchSelect billing={billing} setJob={setJob} />
                    </div>

                    {/* notes */}
                    <div className='w-md-50 order-md-0 mt-3 mt-md-0'>
                        <NotesInput
                            error={error}
                            isResizingImages={isResizingImages}
                            notes={notes} setJob={setJob}
                            setError={setError}
                            setIsResizingImages={setIsResizingImages}
                        />
                    </div>
                </div>
            </div>

            <div className='mt-4 mt-sm-0'>
                <ActionButton
                    alignX='right'
                    isDisabled={isDisabled || isResizingImages}
                    text={(isLoading ? 'Saving...' : 'Save')}
                    type='submit'
                />
            </div>

            {/* any errors other than input validation */}
            {errorOther && <div className='text-danger mt-3 w-100'>{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    </>);
};

export default JobForm;