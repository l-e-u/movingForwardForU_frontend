import { useState } from "react";
import { CSSTransition } from 'react-transition-group';

// hooks
import { useUpdateStatus } from "../hooks/useUpdateStatus.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";

// components
import FormHeader from './FormHeader.js';
import CautionNotice from './CautionNotice.js';
import StatusForm from './StatusForm.js';

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
        <CSSTransition
            appear={true}
            classNames='scale-'
            in={true}
            timeout={500}
        >
            <div className='shadow'>
                <FormHeader text='Edit Status' handleCloseForm={() => setShowThisForm(false)} />

                <div className='rounded-bottom background-white text-reset p-3'>
                    <CautionNotice text='Changes will also reflect on all jobs with the same status.' />

                    <StatusForm
                        status={status}
                        setStatus={setStatus}
                        error={error}
                        isDisabled={isLoading || noInputChanges}
                        isLoading={isLoading}
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
            </div>
        </CSSTransition>
    );
};

export default EditStatusForm;