import { useState, useEffect } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// components
import CreatedInfo from "../components//CreatedInfo.js";
import CardContainer from "../components/CardContainer.js";
import JobOverview from "../components/JobOverview.js";
import CreateJobForm from "../components/CreateJobForm.js";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Jobs = () => {
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    // local state
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // get jobs once
    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('/api/jobs', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all jobs
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_JOBS', payload: json });
            };
        };

        if (user) fetchJobs();
    }, [dispatch, user]);

    // function closure returns an async func that deletes the job
    const handleDelete = (job_id) => {
        return async () => {
            if (!user) return;

            const response = await fetch('/api/jobs/' + job_id, {
                method: 'DELETE',
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'DELETE_JOB', payload: json })
            };
        };
    };

    // shows the create form and hides other forms
    const handleCreateClick = () => {
        setShowCreateForm(true);
        setShowEditForm(false);
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

                return (
                    <div key={_id} className='my-4'>
                        <CardContainer >
                            <JobOverview {...job} />
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