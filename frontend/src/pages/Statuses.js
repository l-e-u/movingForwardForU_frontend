import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";

// components
import CardContainer from '../components/CardContainer.js';
import EditStatusForm from '../components/EditStatusForm.js';
import CreateStatusForm from "../components/CreateStatusForm.js";
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteDocIcon from "../components/DeleteDocIcon.js";
import EditDocIcon from "../components/EditDocIcon.js";
import StatusOverview from "../components/StatusOverview.js";

const Statuses = () => {
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    // local state
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // get statuses once
    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('/api/statuses', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all the statuses
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STATUSES', payload: json });
            };
        };

        if (user) fetchStatuses();
    }, [dispatch, user]);

    // deletes status by _id
    const deleteById = async (_id) => {
        const response = await fetch('/api/statuses/' + _id, {
            method: 'DELETE',
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_STATUS', payload: json })
        };
    };

    // function closure returns a func that sets the status to be edited, hides the CreateStatusForm and shows EditStatusForm
    const handleEditClick = (status) => {
        return () => {
            setDocToEdit(status);
            setShowCreateForm(false);
            setShowEditForm(true);
        };
    };

    // shows the create form and hides other forms
    const handleCreateClick = () => {
        setShowCreateForm(true);
        setShowEditForm(false);
    };

    return (
        <div className='statuses'>
            {showCreateForm && <CreateStatusForm isShowing={showCreateForm} setShow={setShowCreateForm} />}

            {!showCreateForm &&
                <button
                    type='button'
                    className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
                    onClick={handleCreateClick}>
                    Create A Status
                </button>
            }

            {statuses && statuses.map((status) => {
                const { _id, createdBy, createdAt } = status;
                const isEditingThisDoc = showEditForm && (_id === docToEdit._id);
                const editFormProps = {
                    ...status,
                    setShowThisForm: setShowEditForm
                };

                return (
                    <div key={_id} className='my-4'>
                        <CardContainer >
                            {/* Edit and Delete options */}
                            <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
                                {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(status)} />}

                                <div className="ps-5">
                                    <DeleteDocIcon onClick={() => deleteById(_id)} />
                                </div>
                            </div>

                            {isEditingThisDoc ? <EditStatusForm {...editFormProps} /> : <StatusOverview {...status} />
                            }
                        </CardContainer>
                        <div className="mt-1 pe-2">
                            <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Statuses;