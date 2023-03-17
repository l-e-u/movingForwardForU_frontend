import { useEffect, useState } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useStatusesContext } from '../hooks/useStatusesContext.js';

// components
import EditStatusForm from '../components/EditStatusForm.js';
import CreateStatusForm from '../components/CreateStatusForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ActionButton from '../components/ActionButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import OptionsMenu from '../components/OptionsMenu.js';
import Card from '../components/Card.js';
import SmallHeader from '../components/SmallHeader.js';

const Statuses = () => {
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    // local state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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

    if (error) {
        return <p className='text-danger'>Could not load, check network and refresh.</p>
    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateStatusForm setShowThisForm={setShowCreateForm} /> :
                    <ActionButton
                        alignX='right'
                        handleOnClick={() => {
                            setShowCreateForm(true);
                            setShowEditForm(false);
                            setShowOptionsMenu(false);
                            setSelectedStatusId(null);
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
                        const { _id } = status;
                        const isSelectedStatus = selectedStatusId === _id;

                        switch (true) {
                            case (showEditForm && isSelectedStatus):
                                return (<div className='position-relative' key={_id}>
                                    <EditStatusForm prevStatus={status} setShowThisForm={setShowEditForm} />
                                </div>);

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickEditOption={() => {
                                            setShowEditForm(true);
                                            setShowCreateForm(false);
                                            setShowOptionsMenu(false);
                                        }}
                                        handleOnClickMenu={() => {
                                            setSelectedStatusId(_id);
                                            setShowOptionsMenu(true);
                                        }}
                                        showMenu={showOptionsMenu && isSelectedStatus}
                                    />
                                    <Card
                                        header={<div>{status.name}</div>}
                                        body={
                                            <div>
                                                <SmallHeader text='Description' />
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{status.description}</p>
                                            </div>
                                        }
                                        footer={<CreatedInfo createdAt={status.createdAt} createdBy={status.createdBy} />}
                                    />
                                </div>)
                        }
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Statuses;