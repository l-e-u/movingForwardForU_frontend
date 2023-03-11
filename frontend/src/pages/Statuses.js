import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useStatusesContext } from '../hooks/useStatusesContext.js';

// components
import CardContainer from '../components/CardContainer.js';
import EditStatusForm from '../components/EditStatusForm.js';
import CreateStatusForm from '../components/CreateStatusForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import EditDocIcon from '../components/EditDocIcon.js';
import StatusOverview from '../components/StatusOverview.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';

const Statuses = () => {
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    // local state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // get statuses once
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/statuses', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all contacts
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                dispatch({ type: 'SET_STATUSES', payload: json });
            };
        })();
    }, []);

    // function closure returns a func that sets the status to be edited, hides the CreateStatusForm and shows EditStatusForm
    const handleEditClick = (status) => {
        return () => {
            setDocToEdit(status);
            setShowCreateForm(false);
            setShowEditForm(true);
        };
    };

    if (error) {
        return <p className='text-danger'>Could not load, check network and refresh.</p>
    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateStatusForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton
                        handleOnClick={() => {
                            setShowCreateForm(true);
                            setShowEditForm(false);
                        }}
                        text='Create a Status'
                    />
                }
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {statuses &&
                <FlexBoxWrapper>
                    {statuses.map((status) => {
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
                                </div>}

                                {isEditingThisDoc ? <EditStatusForm {...editFormProps} /> : <StatusOverview {...status} />
                                }
                                <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                            </CardContainer>
                        )
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Statuses;