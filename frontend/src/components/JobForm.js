// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';
import NotesInput from './NotesInput';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled }) => {
    const { status, customer, reference, parcel, drivers, notes } = job;

    const errorOther = error?.server;

    return (
        <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
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

            {/* DRIVERS */}
            <DriverSearchSelect drivers={drivers} setJob={setJob} />

            {/* PICKUP ADDRESS/TIME */}
            <PickupOrDeliveryInput
                isPickup={true}
                error={error?.['pickup.address']}
                job={job}
                setJob={setJob} />

            {/* DELIVERY ADDRESS/TIME */}
            <PickupOrDeliveryInput
                isPickup={false}
                error={error?.['delivery.address']}
                job={job}
                setJob={setJob} />

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