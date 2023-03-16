import { useEffect, useState } from "react";

// hooks
import { useMyJobsContext } from "../hooks/useMyJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// components
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import JobCard from '../components/JobCard.js';

const MyJobs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const { myJobs, dispatch } = useMyJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/jobs/', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all jobs returned
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);

                // only get the jobs that have current user assigned as driver
                const jobsAssignedToMe = json.filter((job) => {
                    return job.drivers.some((driver) => {
                        return driver._id === user._id
                    });
                });
                dispatch({ type: 'SET_MYJOBS', payload: jobsAssignedToMe });
            };
        })();
    }, [dispatch, user]);

    return (
        <PageContentWrapper>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {myJobs &&
                <FlexBoxWrapper>
                    {myJobs.map((job) => {
                        return (
                            <JobCard {...job} key={job._id} />
                        )
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default MyJobs;