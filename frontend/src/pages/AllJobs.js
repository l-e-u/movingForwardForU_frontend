import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';
import OverviewContainer from "../components/OverviewContainer.js";
import JobForm from '../components/JobForm.js';

// components
import JobDetails from '../components/JobDetails.js';

const AllJobs = () => {
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const [myJobs, setMyJobs] = useState([]);

    useEffect(() => {
        const fetchAllJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });
            const allJobs = await response.json();

            if (response.ok) {
                const jobsAssignedToMe = allJobs.filter((job) => {
                    return job.drivers.some((driver) => {
                        return driver._id === user._id
                    });
                });
                dispatch({ type: 'SET_JOBS', payload: allJobs });
                setMyJobs(jobsAssignedToMe);
            };
        };

        if (user) fetchAllJobs();
    }, [dispatch, user]);

    return (
        <div className='jobs'>
            {/* <JobForm /> */}
            <h3>My Jobs</h3>
            {myJobs.map((job) => {
                return (
                    <OverviewContainer key={job._id}>
                        <JobDetails job={job} />
                    </OverviewContainer>
                );
            })}
            <h3>All Jobs</h3>
            {jobs && jobs.map((job) => {
                return (
                    <OverviewContainer key={job._id}>
                        <JobDetails job={job} />
                    </OverviewContainer>
                );
            })}
        </div>
    )
};

export default AllJobs;