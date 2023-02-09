import { useEffect } from "react";
import { useMyJobsContext } from "../hooks/useMyJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// components
import OverviewContainer from "../components/OverviewContainer.js";
import LogHistory from "../components/LogHistory.js";
import TransportInfo from "../components/TransportInfo.js";

const MyJobs = () => {
    const { myJobs, dispatch } = useMyJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs/', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all jobs returned
            const jobs = await response.json();

            if (response.ok) {
                const jobsAssignedToMe = jobs.filter((job) => {
                    return job.drivers.some((driver) => {
                        return driver._id === user._id
                    });
                });
                dispatch({ type: 'SET_MYJOBS', payload: jobsAssignedToMe });
            };
        };

        if (user) fetchJobs();
    }, [dispatch, user]);

    return (
        <div className='jobs'>
            {myJobs && myJobs.map((job) => {
                return (
                    <OverviewContainer key={job._id}>
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
                    </OverviewContainer>)
            })}
        </div>
    )
};

export default MyJobs;