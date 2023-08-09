import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useMyJobsContext } from "../hooks/useMyJobsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// functions
// import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { urlQueryString } from '../utils/StringUtils';

// components

const MyJobs = ({
   filters,
   setFilters,
   selectedLink,
   setSelectedLink,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;

   // user can click on a job from the list below and set the selectedJobID which is used to fill the information for the JobDetails component
   const [selectedJob, setSelectedJob] = useState(null);

   // context
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

   // fetches results as the user chooses filters or changes limits for results
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const filterQuery = urlQueryString(filters);

         // this will fetch jobs limited to user selection and with user selected filters, finally only jobs that have user assigned as driver
         const response = await fetch(`${API_BASE_URL}/api/jobs?page=${currentPage}&limit=${limit}${filterQuery}&drivers=${user._id}`, {
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
   }, [API_BASE_URL, currentPage, dispatch, filters, limit, user]);

   return (
      <></>
   );


   //    return (
   //       <Page>
   //          <div className='d-flex flex-column gap-2 mb-3'>
   //             <NavPagination
   //                currentPage={currentPage}
   //                limit={limit}
   //                setCurrentPage={setCurrentPage}
   //                setLimit={setLimit}
   //                setTotalPages={setTotalPages}
   //                totalPages={totalPages}
   //                totalResults={totalResults}
   //             />

   //             <FilterAndASort filters={filters} setFilters={setFilters} />
   //          </div>

   //          {/* show spinner with actively fetching data */}
   //          {isLoading && <div className='my-5'><LoadingDocuments /></div>}

   //          {error && <ErrorLoadingDocuments docType='Jobs' />}

   //          {(myJobs && !isLoading) &&
   //             <FlexBoxWrapper>
   //                {/* show a message when the results have loaded and there's not results */}
   //                {(totalResults === 0) &&
   //                   <div className='outline shadow-sm background-white p-3 text-center'>There are no results.</div>
   //                }

   //                {myJobs.map((job) => {
   //                   return (
   //                      <JobCard {...job} key={job._id} singleNoteInput={true} />
   //                   )
   //                })}
   //             </FlexBoxWrapper>
   //          }
   //       </Page>
   //    );
};

export default MyJobs;