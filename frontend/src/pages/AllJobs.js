import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';
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
                        console.log('driver:', driver);
                        console.log('user:', user);
                        return driver._id === user._id
                    });
                });
                dispatch({ type: 'SET_JOBS', payload: allJobs });
                console.log('myJobs:', jobsAssignedToMe);
                setMyJobs(jobsAssignedToMe);
            };
        };

        if (user) fetchAllJobs();
    }, [dispatch, user]);
    console.log(jobs);

    return (
        <div className='jobs'>
            <JobForm />
            <h2>My Jobs</h2>
            {myJobs.map((job) => {
                return <JobDetails key={job._id} job={job} />
            })}
            <h2>All Jobs</h2>
            {jobs && jobs.map((job) => {
                return <JobDetails key={job._id} job={job} />
            })}
        </div>
    )
};

export default AllJobs;