import { useState } from "react";
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";
import CloseFormButton from './CloseFormButton.js';
import FormHeader from './FormHeader.js';
import StatusForm from './StatusForm.js';

// Form to update a status
const EditStatusForm = ({ prevStatus, setShowThisForm }) => {
    const { updateStatus, error, isLoading } = useUpdateStatus();
    const { name: prevName, description: prevDescription } = prevStatus;
    const [status, setStatus] = useState({ name: prevName, description: prevDescription });
    const { name, description } = status;

    // user cannot update a doc that has not character changes, this disables the update button
    const nameHasChanged = !noCharChanges(prevName, name);
    const descHasChanged = !noCharChanges(prevDescription, description);
    const noInputChanges = !nameHasChanged && !descHasChanged;

    return (
        <div>
            <FormHeader text='Edit Status'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <p>
                <i className="bi bi-exclamation-triangle-fill text-warning pe-2"></i>
                Changes will also reflect on all jobs with the same status.
            </p>

            <StatusForm
                status={status}
                setStatus={setStatus}
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    // when patching, only update the data that has been changed, any undefined values will be ignored in the backend
                    await updateStatus({
                        _id: prevStatus._id,
                        name: nameHasChanged ? status.name : undefined,
                        description: descHasChanged ? status.description : undefined
                    })
                        .then(isUpdated => {
                            if (isUpdated) setShowThisForm(false);
                        });
                }} />
        </div>
    );
};

export default EditStatusForm;