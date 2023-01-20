import { useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";

const JobForm = () => {
    const { dispatch } = useJobsContext();
    const [status, setStatus] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const job = {
            status,
            from,
            to
        };

        const response = await fetch('http://localhost:4000/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        };
        if (response.ok) {
            // reset the form
            [setStatus, setFrom, setTo].forEach((stateSetter) => stateSetter(''));

            setError(null);
            console.log('new job added:', json);
            dispatch({ type: 'CREATE_JOB', payload: json });
        };
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Job</h3>

            {/* selection for job status */}
            <label htmlFor="status">Status:</label>
            <input
                type="text"
                name="status"
                id="status"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
            />

            {/* input for job pick up from address */}
            <label htmlFor="from">From:</label>
            <input
                type="text"
                name="from"
                id="from"
                onChange={(e) => { setFrom(e.target.value) }}
                value={from}
            />

            {/* input for job delivery to address */}
            <label htmlFor="to">To:</label>
            <input
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