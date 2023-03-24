import { useEffect, useState } from "react";

// hooks
import { useMyJobsContext } from "../hooks/useMyJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// date fns
// import formatDistanceToNow from "date-fns/formatDistanceToNow";

// components
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import JobCard from '../components/JobCard.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import NavPagination from '../components/NavPagination.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

const MyJobs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const { myJobs, dispatch } = useMyJobsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const currentPage = 1;
            const limit = 0;
            const query = `?page=${currentPage}&limit=${limit}`;

            const response = await fetch('/api/jobs/filter/drivers/' + user._id + query, {
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

                dispatch({ type: 'SET_MYJOBS', payload: json.results });
            };
        })();
    }, [dispatch, user]);

    return (
        <PageContentWrapper>

            <NavPagination
                context='SET_MYJOBS'
                filterString={'/filter/drivers/' + user._id}
                setError={setError}
                setIsLoading={setIsLoading}
            />

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