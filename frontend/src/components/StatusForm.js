import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ isShowing, setShow }) => {
    const { createStatus, error, isLoading } = useCreateStatus();

    // local state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const nameNoExtraSpacesAndTrimmed = name.replace(/\s+/g, ' ').trim();
    const descNoExtraSpacesAndTrimmed = description.replace(/\s+/g, ' ').trim();

    // error handling
    let nameErrorClass = '';
    let descErrorClass = '';
    let nameErrorMsg;
    let descErrorMsg;

    // handles errors thrown by failed validations on models
    if (error && error.errors) {
        const { errors } = error;
        if (errors.name) {
            nameErrorClass = ' is-invalid';
            nameErrorMsg = errors.name.message;
        };

        if (errors.description) {
            descErrorClass = ' is-invalid';
            descErrorMsg = errors.description.message;
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setName(nameNoExtraSpacesAndTrimmed);
        setDescription(descNoExtraSpacesAndTrimmed);

        await createStatus({
            name: nameNoExtraSpacesAndTrimmed,
            description: descNoExtraSpacesAndTrimmed
        });
    };

    return (
        <form className='position-relative mb-4' onSubmit={handleSubmit}>
            <h2>Add a New Status</h2>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                    type="text"
                    className={'form-control' + nameErrorClass}
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <div className="invalid-feedback">{nameErrorMsg}</div>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    type="text"
                    className={'form-control' + descErrorClass}
                    name="description"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></textarea>
                <div className="invalid-feedback">{descErrorMsg}</div>
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => setShow(!isShowing)}>Cancel</button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className='btn btn-sm btn-success rounded-pill px-3'>Save</button>
            </div>

            {/* any errors other than name and description input validation */}
            {(error && !error.errors) && <div className="text-danger mt-3">{error.name || error.message + ' Refresh page. If problem persists, contact developer.'}</div>}
        </form>
    );
};

export default CreateStatusForm;