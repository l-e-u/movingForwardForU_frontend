import { useState } from "react";
import { useCreateStatus } from "../hooks/useCreateStatus.js";

// components
import FormHeader from './FormHeader.js';
import StatusForm from './StatusForm.js';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ setShowThisForm }) => {
    const { createStatus, error, isLoading } = useCreateStatus();
    const [status, setStatus] = useState({ name: '', description: '' });

    return (
        <div className='shadow'>
            <FormHeader text='New Status' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
                <StatusForm
                    status={status}
                    setStatus={setStatus}
                    error={error}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    handleSubmit={async (e) => {
                        e.preventDefault();

                        await createStatus(status)
                            .then((isCreated) => {
                                if (isCreated) setShowThisForm(false);
                            });
                    }} />
            </div>
        </div>
    );
};

export default CreateStatusForm;