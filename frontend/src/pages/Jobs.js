import { useState, useEffect } from 'react';
import { useJobsContext } from '../hooks/useJobsContext.js';

// hooks
import { useAuthContext } from '../hooks/useAuthContext.js';

// components
import CreatedInfo from '../components//CreatedInfo.js';
import CardContainer from '../components/CardContainer.js';
import JobOverview from '../components/JobOverview.js';
import CreateJobForm from '../components/CreateJobForm.js';
import EditDocIcon from '../components/EditDocIcon.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import EditJobForm from '../components/EditJobForm.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Jobs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const { user } = useAuthContext();
    const { jobs, dispatch } = useJobsContext();

    // get jobs once
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/jobs', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all fees
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                dispatch({ type: 'SET_JOBS', payload: json });
            };
        })();
    }, []);

    // function closure returns a func that sets the contact to be edited, hides the CreateStatusForm and shows EditStatusForm
    const handleEditClick = (job) => {
        return () => {
            setDocToEdit(job);
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
                    <CreateJobForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton text='Create a Job' handleOnClick={() => {
                        setShowCreateForm(true);
                        setShowEditForm(false);
                    }}
                    />
                }
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {jobs &&
                <FlexBoxWrapper>
                    {jobs.map((job) => {
                        const { _id, createdBy, createdAt } = job;
                        const isEditingThisDoc = showEditForm && (_id === docToEdit._id);

                        return (
                            <CardContainer key={_id} hasCreatedInfo={true}>
                                {/* Edit and Delete options */}
                                <div className='position-absolute top-0 end-0 pe-3 pt-2 d-flex'>
                                    {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(job)} />}
                                </div>

                                {isEditingThisDoc ?
                                    <EditJobForm prevJob={job} setShowThisForm={setShowEditForm} /> :
                                    <JobOverview {...job} listDrivers={true} listFees={true} />
                                }
                                <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                            </CardContainer>
                        );
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Jobs; 