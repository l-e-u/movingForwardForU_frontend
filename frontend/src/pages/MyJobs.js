import { useEffect, useState } from "react";

// hooks
import { useMyJobsContext } from "../hooks/useMyJobsContext.js";
import { useAuthContext } from '../hooks/useAuthContext.js';

// functions
// import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { urlQueryString } from '../utils/StringUtils.js';

// components
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import JobCard from '../components/JobCard.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import NavPagination from '../components/NavPagination.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

const MyJobs = () => {
    const { user } = useAuthContext();
    const { myJobs, dispatch } = useMyJobsContext();

    // used during fetching
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    // pagination state
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // filters
    const [filters, setFilters] = useState({});

    // fetches results as the user chooses filters or changes limits for results
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const filterQuery = urlQueryString(filters);

            // this will fetch jobs limited to user selection and with user selected filters, finally only jobs that have user assigned as driver
            const response = await fetch(`/api/jobs?page=${currentPage}&limit=${limit}${filterQuery}&drivers=${user._id}`, {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting the list of jobs depending on page and limit
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                setTotalPages(json.totalPages);
                setTotalResults(json.count);
                dispatch({ type: 'SET_MYJOBS', payload: json.results });

            };
        })();
    }, [currentPage, dispatch, filters, limit, user]);

    return (
        <PageContentWrapper>

            <NavPagination
                currentPage={currentPage}
                limit={limit}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                setTotalPages={setTotalPages}
                totalPages={totalPages}
                totalResults={totalResults}
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