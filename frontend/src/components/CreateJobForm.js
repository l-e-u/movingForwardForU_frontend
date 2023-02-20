import { useEffect, useState } from 'react';
import { useJobsContext } from '../hooks/useJobsContext.js';
import { useStatusesContext } from '../hooks/useStatusesContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useUsersContext } from '../hooks/useUsersContext.js';
import { useCreateJob } from '../hooks/useCreateJob.js';

// components
import DateInput from './DateInput.js';
import TimeInput from './TimeInput.js';
import AddressInput from './AddressInput.js';
import SmallHeader from './SmallHeader.js';

// functions
import { removeExtraSpaces } from '../utils/StringUtils.js';
import DriversInput from './DriversInput.js';

const CreateJobForm = ({ setShowThisForm }) => {
    const { createJob, error, isLoading } = useCreateJob();

    const { user } = useAuthContext();
    const { dispatch: jobsDispatch } = useJobsContext();
    const { contacts, dispatch: contactsDispatch } = useContactsContext();
    const { statuses, dispatch: statusesDispatch } = useStatusesContext();
    const { users, dispatch: usersDispatch } = useUsersContext();

    // local state: user input
    const [job, setJob] = useState({
        pickup: { address: '' },
        delivery: { address: '' },
        drivers: [],
        parcel: '',
        reference: '',
        customer: '',
        logs: []
    });

    const [pickupAddress, setPickupAddress] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date());
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [drivers, setDrivers] = useState([]);
    const [parcel, setParcel] = useState('');
    const [reference, setReference] = useState('');
    const [customer, setCustomer] = useState('');
    const [logs, setLogs] = useState([]);

    // selected options
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [selectedContactId, setSelectedContactId] = useState(null);

    // error identification for inputs with validators
    const errorFromPickupAddressInput = (error && error['pickup.address']);
    const errorFromDeliveryAddressInput = (error && error['delivery.address']);
    const errorFromStatusInput = (error && error.status);
    const errorFromCustomerInput = (error && error.customer);

    // fetch all statuses and contacts
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('/api/statuses', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            if (response.ok) return await response.json();
        };

        const fetchContacts = async () => {
            const response = await fetch('/api/contacts', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            if (response.ok) return await response.json();
        };

        const fetchUsers = async () => {
            const response = await fetch('/api/users', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            if (response.ok) return await response.json();
        };

        // ensure the server returned all our requests with valid data
        Promise.all([fetchStatuses(), fetchContacts(), fetchUsers()])
            .then(([fetchedStatuses, fetchedContacts, fetchedUsers]) => {
                statusesDispatch({ type: 'SET_STATUSES', payload: fetchedStatuses });
                contactsDispatch({ type: 'SET_CONTACTS', payload: fetchedContacts });
                usersDispatch({ type: 'SET_USERS', payload: fetchedUsers });
            })
            .catch((reject) => console.log(reject));
    }, [statusesDispatch, contactsDispatch, usersDispatch]);

    // input does not allow extra spaces
    const handleOnChangeRemoveExtraSpaces = (stateSetter) => {
        return (e) => stateSetter(e.target.value.replace(/\s+/g, ' '));
    };

    const handleOnChangeCustomerDataList = (e) => {
        // remove extra spaces from input and set customer state
        handleOnChangeRemoveExtraSpaces(setCustomer)(e);

        // we can access the up to date value this way without having to depend on a rerender
        setCustomer(customerName => {

            // if the input matches a contact, set the selected contacts id
            const customer = contacts.find(contact => contact.organization === customerName);
            if (customer) {
                setSelectedContactId(customer._id)
            }
            else {
                setSelectedContactId(null);
            };

            // we're not changing the value so always return it
            return customerName;
        });
    };

    // user input is used to look up the id of the doc being selected
    const handleOnChangeSelect = (e) => {
        const value = e.target.value;
        const doc = statuses.find(status => value === status.name);

        if (doc) setSelectedStatusId(doc._id);
    };

    // POST a new job
    const handleSubmit = async (e) => {
        e.preventDefault();

        await createJob({
            reference,
            parcel,
            drivers,
            status: selectedStatusId,
            customer: selectedContactId,
            pickup: {
                address: pickupAddress
            },
            delivery: {
                address: deliveryAddress
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3 className='m-0' >New Job</h3>
                <button
                    type='button'
                    className='btn border-0'
                    onClick={() => setShowThisForm(false)} >
                    <i className='bi bi-x-lg'></i>
                </button>
            </div>

            <p className='text-danger w-100 text-end'> <small>* Required fields</small></p>

            {/* STATUS */}
            <div className='form-floating mb-2'>
                <select
                    className={'form-select' + (errorFromStatusInput ? ' is-invalid' : '')}
                    type='text'
                    name='status'
                    id='status'
                    aria-label='Status'
                    onChange={handleOnChangeSelect}>
                    {!selectedStatusId && <option>Select...</option>}
                    {statuses && statuses.map(status => {
                        const { _id, name } = status;
                        return (
                            <option key={_id} value={name}>{name}</option>
                        )
                    })}
                </select>
                <label htmlFor='status' className='form-label required'>
                    Status
                    {errorFromStatusInput && <span className='inputError'>{error.status.message}</span>}
                </label>
            </div>

            {/* CUSTOMER */}
            <div className='form-floating mb-2'>
                <input
                    className={'form-select' + (errorFromCustomerInput ? ' is-invalid' : '')}
                    aria-label='Customer'
                    list='customerDataList'
                    type='text'
                    name='customer'
                    id='customer'
                    placeholder='Search or select...'
                    value={customer}
                    onChange={handleOnChangeCustomerDataList} />
                <label htmlFor='customer' className='form-label required'>
                    Customer
                    {errorFromCustomerInput && <span className='inputError'>{error.customer.message}</span>}
                </label>
                <datalist id='customerDataList'>
                    {contacts && contacts.map(contact => {
                        const { _id, organization } = contact;

                        return <option key={_id} value={organization}>{organization}</option>
                    })}
                </datalist>
            </div>

            {/* REFERENCE */}
            <div className='form-floating mb-2'>
                <input
                    className='form-control'
                    type='text'
                    name='reference'
                    id='reference'
                    placeholder='Reference #'
                    value={reference}
                    onChange={(e) => setReference(removeExtraSpaces(e.target.value))}
                    onBlur={() => setReference(reference.trim())} />
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
                    onChange={(e) => setParcel(removeExtraSpaces(e.target.value))}
                    onBlur={() => setParcel(parcel.trim())} />
                <label htmlFor='parcel' className='form-label'>Parcel</label>
            </div>

            {/* DRIVERS */}
            <DriversInput drivers={drivers} setDrivers={setDrivers} />

            {/* PICKUP ADDRESS */}
            <div className='form-floating my-2'>
                <input
                    type='text'
                    className={'form-control' + (errorFromPickupAddressInput ? ' is-invalid' : '')}
                    name='pickupAddress'
                    placeholder='Pickup Address'
                    id='pickupAddress'
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(removeExtraSpaces(e.target.value))}
                    onBlur={() => setPickupAddress(pickupAddress.trim())} />
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
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(removeExtraSpaces(e.target.value))}
                    onBlur={() => setDeliveryAddress(deliveryAddress.trim())} />
                <label htmlFor='deliveryAddress' className='form-label required'>
                    Delivery Address
                    {errorFromDeliveryAddressInput && <span className='inputError'>{error['delivery.address'].message}</span>}
                </label>
            </div>

            <button
                type='submit'
                disabled={false}
                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>Create</button>

            {/* any errors other than input validation */}
            {/* {(error && error.server) && <div className='text-danger mt-3'>{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>} */}
        </form >
    );
};

export default CreateJobForm;