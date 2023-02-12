import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ isShowing, setShow }) => {
    const { createStatus, error, isLoading } = useCreateStatus();
    let nameErrorClass = '';
    let descriptionErrorClass = '';

    // local state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // handles errors thrown by failed validations on models
    if (error && error.errors) {
        const { errors } = error;
        if (errors.name) nameErrorClass = 'is-invalid';
        if (errors.description) descriptionErrorClass = 'is-invalid';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // remove extra spaces
        const nameEdited = name.replace(/\s+/g, ' ');
        const descEdited = description.replace(/\s+/g, ' ');
        setName(nameEdited);
        setDescription(descEdited);

        await createStatus({ nameEdited, descEdited });
    };

    return (
        <form className='position-relative mb-4' onSubmit={handleSubmit}>
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

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => setShow(!isShowing)}>Cancel</button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className='btn btn-sm btn-success rounded-pill px-3'>Save</button>
            </div>

            {/* show error message involving mogoose or express issues */}
            {(error && !error.errors) && <div className="text-danger">{error.name || error.message}</div>}
        </form>
    );
};

export default CreateStatusForm;