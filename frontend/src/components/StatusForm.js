import { useState } from "react";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

// Form to create a status for a job and description of what the status means.
const StatusForm = ({ isShowing, setShow }) => {
    const { user } = useAuthContext();
    const { dispatch } = useStatusesContext();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const status = { name, description };

        const response = await fetch('http://localhost:4000/api/statuses', {
            method: 'POST',
            body: JSON.stringify(status),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
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
        };
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Status</h2>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input
                    type="text"
                    className="form-control"
                    name="description"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
            </div>

            <div className="d-flex justify-content-between px-2">
                <button type="button" className="btn btn-sm btn-danger rounded-pill px-3"
                    onClick={() => setShow(!isShowing)}
                >
                    Cancel
                </button>
                <button type="submit" className='btn btn-sm btn-success rounded-pill px-3'>Save</button>
                {error && <div className="error">{error}</div>}
            </div>
        </form>
    );
};

export default StatusForm;