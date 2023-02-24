import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useStatusesContext } from '../hooks/useStatusesContext.js';
import { useGetStatuses } from '../hooks/useGetStatuses.js';

// components
import CardContainer from '../components/CardContainer.js';
import EditStatusForm from '../components/EditStatusForm.js';
import CreateStatusForm from '../components/CreateStatusForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import DeleteDocIcon from '../components/DeleteDocIcon.js';
import EditDocIcon from '../components/EditDocIcon.js';
import StatusOverview from '../components/StatusOverview.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

const Statuses = () => {
    const { getStatuses, error } = useGetStatuses();
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    // local state
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // get statuses once
    useEffect(() => {
        (async () => {
            await getStatuses();
        })();
    }, []);

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

    if (error) {
        return <p className='text-danger'>Could not load, check network and refresh.</p>
    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateStatusForm setShowThisForm={setShowCreateForm} /> :
                    <button
                        type='button'
                        className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
                        onClick={handleCreateClick}>
                        Create A Status
                    </button>
                }

            </div>

            <FlexBoxWrapper>
                {statuses && statuses.map((status) => {
                    const { _id, createdBy, createdAt } = status;
                    const isEditingThisDoc = showEditForm && (_id === docToEdit._id);
                    const editFormProps = {
                        prevStatus: status,
                        setShowThisForm: setShowEditForm
                    };

                    return (
                        <CardContainer key={_id} hasCreatedInfo={true}>
                            {/* Edit and Delete options */}
                            {!isEditingThisDoc && <div className='position-absolute top-0 end-0 pe-3 pt-2 d-flex'>
                                {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(status)} />}

                                <div className='ps-5'>
                                    <DeleteDocIcon onClick={() => deleteById(_id)} />
                                </div>
                            </div>}

                            {isEditingThisDoc ? <EditStatusForm {...editFormProps} /> : <StatusOverview {...status} />
                            }
                            <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                        </CardContainer>
                    )
                })}
            </FlexBoxWrapper>
        </PageContentWrapper>
    );
};

export default Statuses;