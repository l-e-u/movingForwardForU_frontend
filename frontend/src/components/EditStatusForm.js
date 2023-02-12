import { useEffect, useState } from "react";
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// Form to update a status
const UpdateStatusForm = ({ isShowing, setShow, status }) => {
    const { updateStatus, error, isLoading } = useUpdateStatus();

    // local state
    const [name, setName] = useState(status.name);
    const [description, setDescription] = useState(status.description);

    const nameNoExtraSpacesAndTrimmed = name.replace(/\s+/g, ' ').trim();
    const descNoExtraSpacesAndTrimmed = description.replace(/\s+/g, ' ').trim();
    const nameHasChanged = name !== nameNoExtraSpacesAndTrimmed;
    const descHasChanged = description !== descNoExtraSpacesAndTrimmed;
    const noChanges = !nameHasChanged && !descHasChanged;
    let nameErrorClass = '';
    let descriptionErrorClass = '';

    // set the name and description values of the status user clicked on
    useEffect(() => {
        setName(status.name);
        setDescription(status.description);
    }, [status]);

    // handles errors thrown by failed validations on models
    if (error && error.errors) {
        const { errors } = error;
        if (errors.name) nameErrorClass = 'is-invalid';
        if (errors.description) descriptionErrorClass = 'is-invalid';
    };

    const click = () => {
        console.log('name:', name);
        console.log('desc:', description);
        console.log('edited:', nameNoExtraSpacesAndTrimmed);
        console.log('edited:', descNoExtraSpacesAndTrimmed);
        console.log('name has changed:', nameHasChanged);
        console.log('desc has changed:', descHasChanged);
        console.log('no changes?:', noChanges);
        console.log('loading:', isLoading);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setName(nameNoExtraSpacesAndTrimmed);
        setDescription(descNoExtraSpacesAndTrimmed);

        // only store the values that have been updated
        // on the server side, ES6 spread operator will exclude undefined values and only defined values will be updated
        await updateStatus({
            _id: status._id,
            name: nameHasChanged ? nameNoExtraSpacesAndTrimmed : undefined,
            description: descHasChanged ? descNoExtraSpacesAndTrimmed : undefined
        });
    };

    return (
        <form className='position-relative' onSubmit={handleSubmit}>
            <h4 onClick={click}>Edit Status</h4>
            <p>
                <i className="bi bi-exclamation-triangle-fill text-warning pe-2"></i>
                Changes will also reflect on all jobs with the same status.
            </p>

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
                {(error && error.errors.name) && <div className="invalid-feedback">{error.errors.name.message}</div>}
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
                {(error && error.errors.description) && <div className="invalid-feedback">{error.errors.description.message}</div>}
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

            {/* show error message involving mogoose or express issues */}
            {(error && !error.errors) && <div className="text-danger">{error.name || error.message}</div>}
        </form>
    );
};

export default UpdateStatusForm;