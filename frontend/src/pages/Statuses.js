import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";

// components
import OverviewContainer from '../components/OverviewContainer.js';
import EditStatusForm from '../components/EditStatusForm.js';
import StatusForm from "../components/StatusForm.js";
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteDocIcon from "../components/DeleteDocIcon.js";
import EditDocIcon from "../components/EditDocIcon.js";

const Statuses = () => {
    const [statusToEdit, setStatusToEdit] = useState(null);
    const [showCreateStatusForm, setShowCreateStatusForm] = useState(false);
    const [showEditStatusForm, setShowEditStatusForm] = useState(false);
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('http://localhost:4000/api/statuses', {
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
    const deleteStatusById = async (_id) => {
        if (!user) return;

        const response = await fetch('http://localhost:4000/api/statuses/' + _id, {
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

    // function closure, returns a func that can hide the edit form, and will delete selected status
    const handleDeleteClick = (_id) => {
        return () => {
            // if user deletes the status that is currently loaded on the editStatusForm then remove the editStatusForm
            if (_id === statusToEdit._id) setShowEditStatusForm(false);
            deleteStatusById(_id);
        };
    };

    // function closure returns a func that sets the status to be edited, hides the CreateStatusForm and shows EditStatusForm
    const handleEditClick = (status) => {
        return () => {
            setStatusToEdit(status);
            setShowCreateStatusForm(false);
            setShowEditStatusForm(true);
        };
    };

    return (
        <div className='statuses'>
            {showCreateStatusForm && <StatusForm isShowing={showCreateStatusForm} setShow={setShowCreateStatusForm} />}


            {!showCreateStatusForm &&
                <button
                    type='button'
                    className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
                    onClick={() => setShowCreateStatusForm(!showCreateStatusForm)}
                >
                    + New Status
                </button>
            }

            {statuses && statuses.map((status) => {
                const { _id } = status;
                const isClickedToEdit = showEditStatusForm && (_id === statusToEdit._id);

                return (
                    <OverviewContainer key={_id} >
                        <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
                            {!isClickedToEdit && <EditDocIcon onClick={handleEditClick(status)} />}
                            <div className="ps-5">
                                <DeleteDocIcon onClick={handleDeleteClick(_id)} />
                            </div>
                        </div>
                        <h4 className="text-primary">{status.name}</h4>
                        <p>{status.description}</p>
                        <CreatedInfo createdBy={status.createdBy} createdAt={status.createdAt} />

                        {/* when user clicks to edit this status, the form will appear right below it */}
                        {isClickedToEdit &&
                            <div className='py-3 mb-2 border-top'>
                                <EditStatusForm status={statusToEdit} isShowing={showEditStatusForm} setShow={setShowEditStatusForm} />
                            </div>
                        }
                    </OverviewContainer>
                )
            })}
        </div>
    );
};

export default Statuses;