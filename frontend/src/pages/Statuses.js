import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";

// components
import OverviewContainer from '../components/OverviewContainer.js';
import EditStatusForm from '../components/EditStatusForm.js';
import CreateStatusForm from "../components/CreateStatusForm.js";
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
            setStatusToEdit(status);
            setShowCreateStatusForm(false);
            setShowEditStatusForm(true);
        };
    };

    return (
        <div className='statuses'>
            {showCreateStatusForm && <CreateStatusForm isShowing={showCreateStatusForm} setShow={setShowCreateStatusForm} />}

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
                const { _id, name, description, createdBy, createdAt } = status;
                const isClickedToEdit = showEditStatusForm && (_id === statusToEdit._id);

                return (
                    <div key={_id} className='my-4'>
                        <OverviewContainer >
                            {/* Edit and Delete options */}
                            <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
                                {!isClickedToEdit && <EditDocIcon onClick={handleEditClick(status)} />}
                                <div className="ps-5">
                                    <DeleteDocIcon onClick={() => deleteById(_id)} />
                                </div>
                            </div>

                            <h4 className="text-primary">{name}</h4>
                            <p>{description}</p>

                            {/* when user clicks to edit this status, the form will appear right below it */}
                            {isClickedToEdit &&
                                <div className='py-3 mb-2 border-top'>
                                    <EditStatusForm
                                        statusId={_id}
                                        statusName={name}
                                        statusDesc={description}
                                        isShowing={showEditStatusForm}
                                        setShow={setShowEditStatusForm}
                                    />
                                </div>
                            }
                        </OverviewContainer>
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