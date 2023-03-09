import { useState } from "react";
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";

// components
import FormHeader from './FormHeader.js';
import CautionNotice from './CautionNotice.js';
import StatusForm from './StatusForm.js';
import XButton from './XButton.js';

// Form to update a status
const EditStatusForm = ({ prevStatus, setShowThisForm }) => {
    const { updateStatus, error, isLoading } = useUpdateStatus();
    const [status, setStatus] = useState(prevStatus);
    const { name: prevName, description: prevDescription } = prevStatus;
    const { name, description } = status;

    // user cannot update a doc that has not character changes, this disables the update button
    const nameHasChanged = !noCharChanges(prevName, name);
    const descHasChanged = !noCharChanges(prevDescription, description);
    const noInputChanges = !nameHasChanged && !descHasChanged;

    return (
        <div>
            <FormHeader text='Edit Status'>
                <XButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <CautionNotice text='Changes will also reflect on all jobs with the same status.' />

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
                        name: nameHasChanged ? name : undefined,
                        description: descHasChanged ? description : undefined
                    })
                        .then(isUpdated => {
                            if (isUpdated) setShowThisForm(false);
                        });
                }} />
        </div>
    );
};

export default EditStatusForm;