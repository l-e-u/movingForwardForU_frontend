import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useContactsContext } from "../hooks/useContactsContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useUsersContext } from "../hooks/useUsersContext.js";

import DateInput from './DateInput.js';
import TimeInput from "./TimeInput.js";
import AddressInput from "./AddressInput.js";

const JobForm = () => {
    const { user } = useAuthContext();
    const { dispatch: jobsDispatch } = useJobsContext();
    const { contacts, dispatch: contactsDispatch } = useContactsContext();
    const { statuses, dispatch: statusesDispatch } = useStatusesContext();
    const { users, dispatch: usersDispatch } = useUsersContext();

    // state for user input
    const [selectedStatusName, setSelectedStatusName] = useState('');
    const [selectedContactOrg, setSelectedContactOrg] = useState('');
    const [fromTab_isActive, setFromTab_isActive] = useState(true);

    // from address info
    const [fromStreet1, setFromStreet1] = useState('');
    const [fromStreet2, setFromStreet2] = useState('');
    const [fromCity, setFromCity] = useState('');
    const [fromState, setFromState] = useState('');
    const [fromZipcode, setFromZipCode] = useState('');
    const [fromAttn, setFromAttn] = useState('');

    // to address info
    const [toStreet1, setToStreet1] = useState('');
    const [toStreet2, setToStreet2] = useState('');
    const [toCity, setToCity] = useState('');
    const [toState, setToState] = useState('');
    const [toZipcode, setToZipCode] = useState('');
    const [toAttn, setToAttn] = useState('');

    const [hours, setHours] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());
    const [month, setMonth] = useState(new Date().getMonth());
    const [day, setDate] = useState(new Date().getDate());
    const [year, setYear] = useState(new Date().getFullYear());

    // state for errors
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    // fetch all statuses and contacts
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('http://localhost:4000/api/statuses');

            if (response.ok) return await response.json();
        };

        const fetchContacts = async () => {
            const response = await fetch('http://localhost:4000/api/contacts');

            if (response.ok) return await response.json();
        };

        const fetchUsers = async () => {
            const response = await fetch('http://localhost:4000/api/users');

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

    // POST a new job
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return
        };

        const selectedStatus = statuses.find(s => s.name === selectedStatusName);
        const selectedContact = contacts.find(c => c.organization === selectedContactOrg);

        // user id is appended on server end
        const job = {
            status_id: selectedStatus._id,
            customer_id: selectedContact._id,
            from: {
                street1: fromStreet1,
                street2: fromStreet2,
                city: fromCity,
                state: fromState,
                zipcode: fromZipcode,
                attn: fromAttn
            },
            to: {
                street1: toStreet1,
                street2: toStreet2,
                city: toCity,
                state: toState,
                zipcode: toZipcode,
                attn: toAttn
            }
        };

        const response = await fetch('http://localhost:4000/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        };

        if (response.ok) {
            // reset the form

            // reset errors
            setError(null);
            setEmptyFields([]);

            jobsDispatch({ type: 'CREATE_JOB', payload: json });
        };
    };

    const handleTabSwitch = (e) => setFromTab_isActive(!fromTab_isActive);

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Job</h3>

            {/* selection for job status */}
            <div>
                <label className="inline" htmlFor="status">Status:</label>
                <select
                    className={emptyFields.includes('Status') ? 'error' : ''}
                    name="status"
                    id="status"
                    onChange={(e) => setSelectedStatusName(e.target.value)}
                >
                    {/* user has to make a selection, once an option has been chosen, the first 'Select...' is disabled */}
                    <option disabled={!!selectedStatusName}>Select...</option>
                    {statuses && statuses.map((status) => {
                        return (
                            <option key={status._id}>{status.name}</option>
                        )
                    })}
                </select>
            </div>

            {/* selection for contact/customer */}
            <div>
                <label className="inline" htmlFor="contact">Contact:</label>
                <select
                    className={emptyFields.includes('Contact') ? 'error' : ''}
                    name="contact"
                    id="contact"
                    onChange={(e) => setSelectedContactOrg(e.target.value)}
                >
                    {/* user has to make a selection, once an option has been chosen, the first 'Select...' is disabled */}
                    <option disabled={!!selectedContactOrg}>Select...</option>
                    {contacts && contacts.map((contact) => {
                        return (
                            <option key={contact._id}>{contact.organization}</option>
                        )
                    })}
                </select>
            </div>

            {/* selection for users */}
            <div>
                <label className="inline" htmlFor="drivers">Drivers:</label>
                <select
                    name="drivers"
                    id="drivers"
                >
                    {users && users.map((driver) => {
                        return (
                            <option key={driver._id}>{driver.username}</option>
                        )
                    })}
                </select>
            </div>

            {/* container for the tabs and its content */}
            <div>
                <div className="tabs flexContainer">
                    <span
                        className={fromTab_isActive ? 'selected' : ''}
                        onClick={handleTabSwitch}
                    >
                        From
                    </span>
                    <span
                        className={fromTab_isActive ? '' : 'selected'}

                        onClick={handleTabSwitch}
                    >
                        To
                    </span>
                </div>
                <div className="tabContent">
                    <DateInput
                        month={month}
                        day={day}
                        year={year}
                        setMonth={setMonth}
                        setDate={setDate}
                        setYear={setYear}
                    />

                    <TimeInput
                        hours={hours}
                        minutes={minutes}
                        setHours={setHours}
                        setMinutes={setMinutes}
                    />

                    {/* input for job pick up from address */}
                    <AddressInput
                        id="job"
                        street1={fromTab_isActive ? fromStreet1 : toStreet1}
                        street2={fromTab_isActive ? fromStreet2 : toStreet2}
                        city={fromTab_isActive ? fromCity : toCity}
                        state={fromTab_isActive ? fromState : toState}
                        zipcode={fromTab_isActive ? fromZipcode : toZipcode}
                        setStreet1={fromTab_isActive ? setFromStreet1 : setToStreet1}
                        setStreet2={fromTab_isActive ? setFromStreet2 : setToStreet2}
                        setCity={fromTab_isActive ? setFromCity : setToCity}
                        setState={fromTab_isActive ? setFromState : setToState}
                        setZipcode={fromTab_isActive ? setFromZipCode : setToZipCode}
                        emptyFields={emptyFields}
                    />
                </div>
            </div>

            <label htmlFor="attn">Attn</label>
            <input
                type="text"
                name="attn"
                id="attn"
                onChange={(e) => {
                    const setStateSetter = fromTab_isActive ? setFromAttn : setToAttn;
                    setStateSetter(e.target.value);
                }}
                value={fromTab_isActive ? fromAttn : toAttn}
            />

            <button>Add Job</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default JobForm;