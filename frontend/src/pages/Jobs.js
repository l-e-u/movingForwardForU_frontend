import { useState, useEffect } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useGetJobs } from '../hooks/useGetJobs.js';

// components
import CreatedInfo from "../components//CreatedInfo.js";
import CardContainer from "../components/CardContainer.js";
import JobOverview from "../components/JobOverview.js";
import CreateJobForm from "../components/CreateJobForm.js";
import EditDocIcon from '../components/EditDocIcon.js';
import DeleteDocIcon from '../components/DeleteDocIcon.js';

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import EditJobForm from '../components/EditJobForm.js';

const Jobs = () => {
    const { getJobs, error, isLoading } = useGetJobs();
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    // local state
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // get jobs once
    useEffect(() => {
        (async () => {
            await getJobs();
        })();
    }, []);

    // deletes contact by _id
    const deleteById = async (_id) => {
        const response = await fetch('/api/contacts/' + _id, {
            method: 'DELETE',
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_CONTACT', payload: json })
        };
    };

    // shows the create form and hides other forms
    const handleCreateClick = () => {
        setShowCreateForm(true);
        setShowEditForm(false);
    };

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
        <div className='jobs'>
            {showCreateForm && <CreateJobForm setShowThisForm={setShowCreateForm} />}

            {!showCreateForm &&
                <button
                    type='button'
                    className={'rounded-pill btn btn-primary btn-sm px-3 d-block mx-auto'}
                    onClick={handleCreateClick}>
                    Create A Job
                </button>
            }

            {jobs && jobs.map((job) => {
                const { _id, createdBy, createdAt } = job;
                const isEditingThisDoc = showEditForm && (_id === docToEdit._id);
                const editFormProps = {
                    prevJob: job,
                    setShowThisForm: setShowEditForm
                };

                job.listDrivers = true;

                return (
                    <div key={_id} className='my-4'>
                        <CardContainer >
                            {/* Edit and Delete options */}
                            <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
                                {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(job)} />}
                                <div className="ps-5">

                                    <DeleteDocIcon onClick={() => deleteById(_id)} />
                                </div>
                            </div>
                            {isEditingThisDoc ?
                                <EditJobForm {...editFormProps} /> :
                                <JobOverview {...job} />
                            }
                        </CardContainer>
                        <div className="mt-1 pe-2">
                            <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Jobs; 