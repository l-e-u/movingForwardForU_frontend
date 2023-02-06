import { useEffect } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// components
import JobDetails from '../components/JobDetails.js';

const MyJobs = () => {
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs/user', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all jobs returned
            const myJobs = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_JOBS', payload: myJobs });
            };
        };

        if (user) fetchJobs();
    }, [dispatch, user]);

    return (
        <div className='jobs'>
            {jobs && jobs.map((job) => {
                return <JobDetails key={job._id} job={job} />
            })}
        </div>
    )
};

export default MyJobs;