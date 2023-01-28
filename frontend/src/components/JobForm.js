import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useContactsContext } from "../hooks/useContactsContext.js";

import DateInput from './DateInput.js';
import TimeInput from "./TimeInput.js";
import AddressInput from "./AddressInput.js";

const JobForm = () => {
    const JobsContext = useJobsContext();
    const jobsDispatch = JobsContext.dispatch;

    const ContactsContext = useContactsContext();
    const contacts = ContactsContext.contacts;
    const contactsDispatch = ContactsContext.dispatch;

    const StatusesContext = useStatusesContext();
    const statuses = StatusesContext.statuses;
    const statusesDispatch = StatusesContext.dispatch;


    // state for user input
    const [selectedStatusName, setSelectedStatusName] = useState('');
    const [selectedContactOrg, setSelectedContactOrg] = useState('');
    const [fromAddressIsChecked, setFromAddressIsChecked] = useState(false);

    // from address info
    const [from, setFrom] = useState('');
    const [fromStreet1, setFromStreet1] = useState('');
    const [fromStreet2, setFromStreet2] = useState('');
    const [fromCity, setFromCity] = useState('');
    const [fromState, setFromState] = useState('');
    const [fromZipcode, setFromZipCode] = useState('');
    const [fromAttn, setFromAttn] = useState('');

    // to address info
    const [to, setTo] = useState('');
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

    // fetch all statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('http://localhost:4000/api/status');

            if (response.ok) return await response.json();
        };

        const fetchContacts = async () => {
            const response = await fetch('http://localhost:4000/api/contacts');

            if (response.ok) return await response.json();
        };

        // ensure the server returned all our requests with valid data
        Promise.all([fetchStatuses(), fetchContacts()])
            .then(([fetchedStatuses, fetchedContacts]) => {
                statusesDispatch({ type: 'SET_STATUSES', payload: fetchedStatuses });
                contactsDispatch({ type: 'SET_CONTACTS', payload: fetchedContacts });
            })
            .catch((reject) => console.log(reject));
    }, [statusesDispatch, contactsDispatch]);

    // POST a new job
    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedStatus = statuses.find(s => s.name === selectedStatusName);
        const selectedContact = contacts.find(c => c.organization === selectedContactOrg);

        // DEV.. TEMP FROM AND TO VALUES
        const job = {
            status_id: selectedStatus._id,
            customer_id: selectedContact._id,
            from: {
                street1: from
            },
            to: {
                street1: to
            }
        };

        const response = await fetch('http://localhost:4000/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        };

        if (response.ok) {
            // reset the form
            [setFrom, setTo].forEach((stateSetter) => stateSetter(''));

            // reset errors
            setError(null);
            setEmptyFields([]);

            jobsDispatch({ type: 'CREATE_JOB', payload: json });
        };
    }

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
            <label>From:</label>
            <AddressInput
                id="from"
                street1={fromStreet1}
                street2={fromStreet2}
                city={fromCity}
                state={fromState}
                zipcode={fromZipcode}
                setStreet1={setFromStreet1}
                setStreet2={setFromStreet2}
                setCity={setFromCity}
                setState={setFromState}
                setZipcode={setFromZipCode}
                emptyFields={emptyFields}
            />

            {/* input for job delivery to address */}
            <label>To:</label>
            <AddressInput
                id="to"
                street1={toStreet1}
                street2={toStreet2}
                city={toCity}
                state={toState}
                zipcode={toZipcode}
                setStreet1={setToStreet1}
                setStreet2={setToStreet2}
                setCity={setToCity}
                setState={setToState}
                setZipcode={setToZipCode}
                emptyFields={emptyFields}
            />

            <button>Add Job</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default JobForm;