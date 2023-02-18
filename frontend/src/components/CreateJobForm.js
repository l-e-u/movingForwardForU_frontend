import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useContactsContext } from "../hooks/useContactsContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useUsersContext } from "../hooks/useUsersContext.js";
import { useCreateJob } from "../hooks/useCreateJob.js";

// components
import DateInput from './DateInput.js';
import TimeInput from "./TimeInput.js";
import AddressInput from "./AddressInput.js";

const CreateJobForm = () => {
    const { createJob, error, isLoading } = useCreateJob();

    const { user } = useAuthContext();
    const { dispatch: jobsDispatch } = useJobsContext();
    const { contacts, dispatch: contactsDispatch } = useContactsContext();
    const { statuses, dispatch: statusesDispatch } = useStatusesContext();
    const { users, dispatch: usersDispatch } = useUsersContext();

    // local state: user input
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
    const [selectedDriverIds, setSelectedDriverIds] = useState([]);

    // error identification for inputs with validators
    const errorFromPickupAddressInput = (error && error['pickup.address']);
    const errorFromDeliveryAddressInput = (error && error['delivery.address']);
    const errorFromStatusInput = (error && error.status);
    const errorFromCustomerInput = (error && error.customer);

    if (errorFromPickupAddressInput) console.log('pickup address ERROR')

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

    const handleOnChangeDataList = (e) => {
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

    // when the input loses focus it trims the input to reflect the value sent to the backend
    const handleOnBlurTrimInput = (stateSetter) => {
        return () => stateSetter(input => input.trim());
    };

    // POST a new job
    const handleSubmit = async (e) => {
        e.preventDefault();

        await createJob({
            reference,
            parcel,
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
        <form className="create" onSubmit={handleSubmit}>
            <h3>New Job</h3>

            <p className="text-danger w-100 text-end"> <small>* Required fields</small></p>

            {/* STATUS */}
            <div className="form-floating mb-2">
                <select
                    className="form-select"
                    type="text"
                    name="status"
                    id="status"
                    aria-label="Status"
                    onChange={handleOnChangeSelect}>
                    {!selectedStatusId && <option>Select...</option>}
                    {statuses && statuses.map(status => {
                        const { _id, name } = status;
                        return (
                            <option key={_id} value={name}>{name}</option>
                        )
                    })}
                </select>
                <label htmlFor="status" className="form-label required">Status</label>
            </div>

            {/* CUSTOMER */}
            <div className="form-floating mb-2">
                <input
                    className="form-select"
                    aria-label="Customer"
                    list="customerDataList"
                    type="text"
                    name="customer"
                    id="customer"
                    placeholder="Type to search..."
                    value={customer}
                    onChange={handleOnChangeDataList} />
                <label htmlFor="customer" className="form-label required">Customer</label>
                <datalist id="customerDataList">
                    {contacts && contacts.map(contact => {
                        const { _id, organization } = contact;

                        return <option key={_id} value={organization}>{organization}</option>
                    })}
                </datalist>
            </div>

            {/* REFERENCE */}
            <div className="form-floating mb-2">
                <input
                    className="form-control"
                    type="text"
                    name="reference"
                    id="reference"
                    placeholder="Reference #"
                    value={reference}
                    onChange={handleOnChangeRemoveExtraSpaces(setReference)}
                    onBlur={handleOnBlurTrimInput(setReference)} />
                <label htmlFor="reference" className="form-label">Reference #</label>
            </div>

            {/* PARCEL */}
            <div className="form-floating mb-2">
                <input
                    type="text"
                    className="form-control"
                    name="parcel"
                    placeholder="Parcel"
                    id="parcel"
                    onChange={handleOnChangeRemoveExtraSpaces(setParcel)}
                    value={parcel}
                    onBlur={handleOnBlurTrimInput(setParcel)} />
                <label htmlFor="parcel" className="form-label">Parcel</label>
            </div>

            {/* PICKUP ADDRESS */}
            <div className="form-floating mb-2">
                <input
                    type="text"
                    className="form-control"
                    name="pickupAddress"
                    placeholder="Pickup Address"
                    id="pickupAddress"
                    onChange={handleOnChangeRemoveExtraSpaces(setPickupAddress)}
                    value={pickupAddress}
                    onBlur={handleOnBlurTrimInput(setPickupAddress)} />
                <label htmlFor="pickupAddress" className="form-label required">
                    Pickup Address
                </label>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    name="deliveryAddress"
                    placeholder="Delivery Address"
                    id="deliveryAddress"
                    onChange={handleOnChangeRemoveExtraSpaces(setDeliveryAddress)}
                    value={deliveryAddress}
                    onBlur={handleOnBlurTrimInput(setDeliveryAddress)} />
                <label htmlFor="deliveryAddress" className="form-label required">
                    Delivery Address
                </label>
            </div>

            <button
                type="submit"
                disabled={false}
                className='btn btn-sm btn-success rounded-pill d-block ms-auto mt-4 px-3'>Create</button>

            {/* any errors other than input validation */}
            {/* {(error && error.server) && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>} */}
        </form >
    );
};

export default CreateJobForm;