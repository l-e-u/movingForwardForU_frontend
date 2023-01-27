import { useState } from "react";
import { useStatusesContext } from "../hooks/useStatusesContext.js";

// Form to create a status for a job and description of what the status means.
const StatusForm = () => {
    const { dispatch } = useStatusesContext();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const status = { name, description };

        const response = await fetch('http://localhost:4000/api/status', {
            method: 'POST',
            body: JSON.stringify(status),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        };
        if (response.ok) {
            dispatch({ type: 'CREATE_STATUS', payload: json });

            // reset the form
            setName('');
            setDescription('');

            setError(null);
            console.log('new status added:', json);
        };
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Status</h3>

            {/* input for status name */}
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />

            {/* input for status description */}
            <label htmlFor="description">Description:</label>
            <input
                type="text"
                name="description"
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />

            <button>Add Status</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default StatusForm;