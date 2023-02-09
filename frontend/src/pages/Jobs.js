import { useEffect } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// components
import CreatedInfo from "../components//CreatedInfo.js";
import OverviewContainer from "../components/OverviewContainer.js";
import TransportInfo from "../components/TransportInfo.js";
import LogHistory from "../components/LogHistory.js";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Jobs = () => {
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs', {
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

            const response = await fetch('http://localhost:4000/api/jobs/' + job_id, {
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

    return (
        <div className='jobs'>
            {jobs && jobs.map((job) => {
                return (
                    <OverviewContainer key={job._id}>
                        <i className="bi bi-trash3-fill" onClick={handleDelete(job.id)} >  </i>
                        <h5 className='text-primary'>{job.status.name}</h5>
                        <h6>{job.customer.organization}</h6>
                        <TransportInfo
                            legend='From'
                            {...job.pickup}
                        />
                        <TransportInfo
                            legend='To'
                            {...job.delivery}
                        />
                        <LogHistory logs={job.logs} />
                        <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                        <CreatedInfo createdBy={job.createdBy} createdAt={job.createdAt} />
                    </OverviewContainer>
                );
            })}
        </div>
    );
};

export default Jobs;