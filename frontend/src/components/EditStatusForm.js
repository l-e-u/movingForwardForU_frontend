import { useEffect, useState } from "react";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

// Form to update a status
const StatusForm = ({ isShowing, setShow, status }) => {
    const { user } = useAuthContext();
    const { dispatch } = useStatusesContext();
    const [name, setName] = useState(status.name);
    const [description, setDescription] = useState(status.description);
    const [error, setError] = useState(null);

    useEffect(() => {
        setName(n => status.name);
        setDescription(d => status.description);
    }, [status]);

    console.log(status)
    console.log(name)
    console.log(description)

    const handleSubmit = async (e) => {
        e.preventDefault();

        // only store the values that have been updated
        // on the server side, ES6 spread operator will exclude undefined values and only defined values will be updated
        const updatedStatus = {
            name: name === status.name ? undefined : name,
            description: description === status.description ? undefined : description
        }

        const response = await fetch('http://localhost:4000/api/statuses/' + status._id, {
            method: 'PATCH',
            body: JSON.stringify(updatedStatus),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting updated status
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        };
        if (response.ok) {
            dispatch({ type: 'UPDATE_STATUS', payload: json });

            // hide the form
            setShow(false);

            setError(null);
        };
    };

    return (
        <form className='position-relative' onSubmit={handleSubmit}>
            <i className="bi bi-x-circle-fill text-danger position-absolute top-0 end-0" onClick={() => setShow(!isShowing)}></i>
            <h2>Edit Status</h2>

            <p>
                <i class="bi bi-exclamation-triangle-fill text-warning pe-2"></i>
                Changes will also reflect on all jobs with the same status.
            </p>

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

            <button type="submit" className='d-flex btn btn-sm btn-success rounded-pill px-3 mx-auto'>Update</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default StatusForm;