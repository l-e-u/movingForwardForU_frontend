import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";

const JobForm = () => {
    const JobsContext = useJobsContext();
    const jobsDispatch = JobsContext.dispatch;

    const StatusesContext = useStatusesContext();
    const statuses = StatusesContext.statuses;
    const statusesDispatch = StatusesContext.dispatch;

    const [statusName, setStatusName] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    // fetch all statuses
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('http://localhost:4000/api/status');
            const json = await response.json();

            // by default the first status is set
            if (response.ok) {
                setStatusName(json[0].name);
                statusesDispatch({ type: 'SET_STATUSES', payload: json });
            };
        };

        fetchStatuses();
    }, [statusesDispatch]);

    // POST a new job
    const handleSubmit = async (e) => {
        e.preventDefault();


        // DEV.. TEMP FROM AND TO VALUES
        const job = {
            statusName,
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

        console.log(json);

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
            <label htmlFor="status">Status:</label>
            <select
                className={emptyFields.includes('Status') ? 'error' : ''}
                name="status"
                id="status"
                onChange={(e) => setStatusName(e.target.value)}
            >
                {statuses && statuses.map((status) => {
                    return (
                        <option key={status._id}>{status.name}</option>
                    )
                })}
            </select>

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