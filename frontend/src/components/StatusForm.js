import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// Form to create a status for a job and description of what the status means.
const StatusForm = ({ isShowing, setShow }) => {
    const { createStatus, error, isLoading } = useCreateStatus();
    let nameErrorClass = '';
    let descriptionErrorClass = '';

    // local state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (error) {
        console.error(error);
        if (error.name) nameErrorClass = 'is-invalid';
        if (error.description) descriptionErrorClass = 'is-invalid';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // trims and removes extra spaces on the frontend; the backend controller will remove extra spaces and the model will trim for validation before saving
        setName(name => name.replace(/\s+/g, ' ').trim());
        setDescription(desc => desc.replace(/\s+/g, ' ').trim());

        await createStatus({ name, description });
    };

    return (
        <form className='position-relative mb-4' onSubmit={handleSubmit}>
            <i class="bi bi-x-circle-fill text-danger position-absolute top-0 end-0" onClick={() => setShow(!isShowing)}></i>
            <h2>Add a New Status</h2>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                    type="text"
                    className={`form-control ${nameErrorClass}`}
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                {(error && error.name) && <div className="invalid-feedback">{error.name.message}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input
                    type="text"
                    className={`form-control ${descriptionErrorClass}`}
                    name="description"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
                {(error && error.description) && <div className="invalid-feedback">{error.description.message}</div>}
            </div>

            <button type="submit" disabled={isLoading} className='d-flex btn btn-sm btn-success rounded-pill px-3 mx-auto'>Save</button>
        </form>
    );
};

export default StatusForm;