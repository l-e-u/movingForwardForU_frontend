import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// components
import FormHeader from './FormHeader.js';
import StatusForm from './StatusForm.js';
import XButton from './XButton.js';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ setShowThisForm }) => {
    const { createStatus, error, isLoading } = useCreateStatus();
    const [status, setStatus] = useState({ name: '', description: '' });

    return (
        <div>
            <FormHeader text='New Status'>
                <XButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <StatusForm
                status={status}
                setStatus={setStatus}
                error={error}
                isDisabled={isLoading}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await createStatus(status)
                        .then((isCreated) => {
                            if (isCreated) setShowThisForm(false);
                        });
                }} />
        </div>
    );
};

export default CreateStatusForm;