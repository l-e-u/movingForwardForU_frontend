import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useContactsContext } from "../hooks/useContactsContext.js";

import DateInput from './DateInput.js';
import TimeInput from "./TimeInput.js";

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
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
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


    console.log(statuses);
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
            <label htmlFor="from">From:</label>
            <input
                className={emptyFields.includes('From') ? 'error' : ''}
                type="text"
                name="from"
                id="from"
                onChange={(e) => { setFrom(e.target.value) }}
                value={from}
            />

            {/* input for job delivery to address */}
            <label htmlFor="to">To:</label>
            <input
                className={emptyFields.includes('To') ? 'error' : ''}
                type="text"
                name="to"
                id="to"
                onChange={(e) => { setTo(e.target.value) }}
                value={to}
            />

            <button>Add Job</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default JobForm;