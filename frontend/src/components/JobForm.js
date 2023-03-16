// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';
import NotesInput from './NotesInput';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';
import FeeSearchSelect from './FeeSearchSelect';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled }) => {
    const { status, customer, fees, reference, parcel, drivers, notes } = job;

    const errorOther = error?.server;

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            <div className='d-md-flex gap-3 mt-1'>
                <div style={{ flex: '1 1 0px' }}>
                    <div className='d-flex flex-column gap-2'>
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
                    </div>
                    <br />
                    {/* PICKUP ADDRESS/TIME */}
                    <PickupOrDeliveryInput
                        isPickup={true}
                        error={error?.['pickup.address']}
                        job={job}
                        setJob={setJob}
                    />
                    <br />
                    {/* DELIVERY ADDRESS/TIME */}
                    <PickupOrDeliveryInput
                        isPickup={false}
                        error={error?.['delivery.address']}
                        job={job}
                        setJob={setJob}
                    />
                </div>

                <div className='d-flex flex-column gap-3 mt-4 mt-md-0' style={{ flex: '0 0 350px' }}>
                    {/* DRIVERS */}
                    <DriverSearchSelect drivers={drivers} setJob={setJob} />

                    {/* FEES */}
                    <FeeSearchSelect feesList={fees} setJob={setJob} />
                </div>
            </div>
            <br />
            <NotesInput notes={notes} setJob={setJob} error={error} setError={setError} />

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