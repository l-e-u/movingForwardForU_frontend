import { useEffect } from "react";
import { useMyJobsContext } from "../hooks/useMyJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// components
import CardContainer from "../components/CardContainer.js";
import JobOverview from '../components/JobOverview.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

const MyJobs = () => {
    const { myJobs, dispatch } = useMyJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('/api/jobs/', {
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
        <PageContentWrapper>
            <FlexBoxWrapper>
                {myJobs && myJobs.map((job) => {
                    return (
                        <CardContainer key={job._id}>
                            <JobOverview {...job} />
                            {/* <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p> */}
                        </CardContainer>
                    )
                })}
            </FlexBoxWrapper>
        </PageContentWrapper>
    )
};

export default MyJobs;