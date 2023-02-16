import { useState } from "react";
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";

// Form to update a status
const EditStatusForm = ({
    setShowThisForm,
    _id,
    name,
    description,
}) => {
    const { updateStatus, error, isLoading } = useUpdateStatus();

    // local state
    const [nameInput, setNameInput] = useState(name);
    const [descriptionInput, setDescriptionInput] = useState(description);

    // error identification
    const errorFromNameInput = (error && error.name);
    const errorFromDescriptionInput = (error && error.description);

    // user cannot update a doc that has not character changes, this disables the update button
    const noChanges = [[name, nameInput ?? ''], [description, descriptionInput ?? '']].every(strings => noCharChanges(strings[0], strings[1]));

    // every input doesn't allow extra spaces
    const handleOnChange = (stateSetter) => {
        return (e) => {
            const value = e.target.value.replace(/\s+/g, ' ');
            stateSetter(value);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateStatus({
            _id,
            name: nameInput,
            description: descriptionInput
        });
    };

    return (
        <form className='position-relative' onSubmit={handleSubmit}>
            <h4>Edit Status</h4>

            <p>
                <i className="bi bi-exclamation-triangle-fill text-warning pe-2"></i>
                Changes will also reflect on all jobs with the same status.
            </p>

            <p className="text-danger w-100 text-end"> <small>* Required fields</small></p>

            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'form-control' + (errorFromNameInput ? ' is-invalid' : '')}
                    name="name"
                    placeholder="Name"
                    id="name"
                    onChange={handleOnChange(setNameInput)}
                    value={nameInput ?? ''} />
                <label htmlFor="name" className="form-label required">
                    Name
                    {errorFromNameInput && <span className="ms-1 text-danger">{': ' + error.name.message}</span>}
                </label>
            </div>

            <div className="form-floating mb-3">
                <textarea
                    type="text"
                    className={'form-control' + (errorFromDescriptionInput ? ' is-invalid' : '')}
                    name="description"
                    placeholder="Description"
                    id="description"
                    onChange={handleOnChange(setDescriptionInput)}
                    value={descriptionInput ?? ''}
                    style={{ height: '100px' }}
                ></textarea>
                <label htmlFor="description" className="form-label required">
                    Description
                    {errorFromDescriptionInput && <span className="ms-1 text-danger">{': ' + error.description.message}</span>}</label>
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3"
                    onClick={() => setShowThisForm(false)}>Cancel</button>
                <button
                    type="submit"
                    disabled={isLoading || noChanges}
                    className='btn btn-sm btn-success rounded-pill px-3'>Update</button>
            </div>

            {/* any errors other than name and description input validation */}
            {(error && error.server) && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default EditStatusForm;