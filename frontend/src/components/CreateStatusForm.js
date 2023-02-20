import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ isShowing, setShow }) => {
    const { createStatus, error, isLoading } = useCreateStatus();

    // local state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // error identification
    const errorFromNameInput = (error && error.name);
    const errorFromDescriptionInput = (error && error.description);

    // input does not allow extra spaces
    const handleOnChangeRemoveExtraSpaces = (stateSetter) => {
        return (e) => stateSetter(e.target.value.replace(/\s+/g, ' '));
    };

    // when the input loses focus it trims the input to reflect the value sent to the backend
    const handleOnBlurTrimInput = (stateSetter) => {
        return () => stateSetter(input => input.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createStatus({
            name,
            description
        });
    };

    return (
        <form className='position-relative mb-4' onSubmit={handleSubmit}>
            <h2>New Status</h2>

            <p className="text-danger w-100 text-end"> <small>* Required fields</small></p>

            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'form-control' + (errorFromNameInput ? ' is-invalid' : '')}
                    name="name"
                    placeholder="Name"
                    id="name"
                    onChange={handleOnChangeRemoveExtraSpaces(setName)}
                    onBlur={handleOnBlurTrimInput(setName)}
                    value={name}
                />
                <label htmlFor="name" className="form-label required">
                    Name
                    {errorFromNameInput && <span className="inputError">{error.name.message}</span>}
                </label>
            </div>

            <div className="form-floating mb-3">
                <textarea
                    type="text"
                    className={'form-control' + (errorFromDescriptionInput ? ' is-invalid' : '')}
                    name="description"
                    placeholder="Description"
                    id="description"
                    onChange={handleOnChangeRemoveExtraSpaces(setDescription)}
                    onBlur={handleOnBlurTrimInput(setDescription)}
                    value={description}
                    style={{ height: '100px' }}
                ></textarea>
                <label htmlFor="description" className="form-label required">
                    Description
                    {errorFromDescriptionInput && <span className="inputError">{error.description.message}</span>}</label>
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => setShow(!isShowing)}>Cancel</button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className='btn btn-sm btn-success rounded-pill px-3'>Create</button>
            </div>

            {/* any errors other than name and description input validation */}
            {(error && error.server) && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default CreateStatusForm;