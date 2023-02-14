import { useState } from "react";
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// Form to update a status
const UpdateStatusForm = ({
    isShowing,
    setShow,
    statusId,
    statusName,
    statusDesc,
}) => {
    const { updateStatus, error, isLoading } = useUpdateStatus();

    // local state
    const [name, setName] = useState(statusName);
    const [description, setDescription] = useState(statusDesc);

    const nameNoExtraSpacesAndTrimmed = name.replace(/\s+/g, ' ').trim();
    const descNoExtraSpacesAndTrimmed = description.replace(/\s+/g, ' ').trim();
    const nameHasChanged = nameNoExtraSpacesAndTrimmed !== statusName;
    const descHasChanged = descNoExtraSpacesAndTrimmed !== statusDesc;
    const noChanges = !nameHasChanged && !descHasChanged;

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setName(nameNoExtraSpacesAndTrimmed);
        setDescription(descNoExtraSpacesAndTrimmed);

        // only store the values that have been updated
        // on the server side, ES6 spread operator will exclude undefined values and only defined values will be updated
        await updateStatus({
            _id: statusId,
            name: nameHasChanged ? nameNoExtraSpacesAndTrimmed : undefined,
            description: descHasChanged ? descNoExtraSpacesAndTrimmed : undefined
        });
    };

    return (
        <form className='position-relative' onSubmit={handleSubmit}>
            <h4>Edit Status</h4>
            <p>
                <i className="bi bi-exclamation-triangle-fill text-warning pe-2"></i>
                Changes will also reflect on all jobs with the same status.
            </p>

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
                    className="btn btn-sm btn-danger rounded-pill px-3"
                    onClick={() => setShow(!isShowing)}>Cancel</button>
                <button
                    type="submit"
                    disabled={isLoading || noChanges}
                    className='btn btn-sm btn-success rounded-pill px-3'>Update</button>
            </div>

            {/* any errors other than name and description input validation */}
            {(error && !error.errors) && <div className="text-danger mt-3">{error.name || error.message + ' Refresh page. If problem persists, contact developer.'}</div>}
        </form>
    );
};

export default UpdateStatusForm;