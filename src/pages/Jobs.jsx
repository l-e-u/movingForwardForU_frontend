import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useGetJobs } from '../hooks/useGetJobs';

// components
import JobDetails from '../components/JobDetails';
import ErrorAlert from '../components/ErrorAlert';
import FadeInList from '../components/FadeInList';
import FormAddNote from '../components/FormAddNote';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import SmallHeader from '../components/SmallHeader';

const Jobs = ({
   filters,
   pagination,
   setFilters,
   setPagination
}) => {
   const { user } = useAuthContext();
   const { jobs } = useJobsContext();

   const { getJobs, error, isLoading } = useGetJobs();

   // form
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);

   const [selectedJob, setSelectedJob] = useState(null);

   // updates the pages.current or pages.total
   const setPages = (page) => {
      const [property, value] = Object.entries(page)[0];

      setPagination({
         ...pagination,
         pages: {
            ...pagination.pages,
            [property]: value
         }
      });
   };

   // updates the results.limit when the limit is changed in nav pagination
   const onChangeLimit = (number) => {
      setPagination({
         ...pagination,
         pages: {
            ...pagination.pages,
            current: 1
         },
         results: {
            total: 1,
            limit: number
         }
      });
   };

   // fetches results as the user chooses filters or changes limits for results
   useEffect(() => {
      getJobs({
         currentPage: pagination.pages.current,
         limit: pagination.results.limit,
         filters: {
            ...filters,
            drivers: [user._id]
         },
         setPaginationTotals: ({ totalNumberOfResults, totalNumberOfPages }) => {
            setPagination({
               ...pagination,
               pages: {
                  ...pagination.pages,
                  total: totalNumberOfPages
               },
               results: {
                  ...pagination.results,
                  total: totalNumberOfResults
               }
            })
         }
      });
   }, [pagination.results.limit, pagination.pages.current, filters]);

   return (
      <>
         <div className='px-3 my-3'>
            {/* Display the total amount of search results */}
            <div className='text-secondary'>
               <SmallHeader text={`Total: ${pagination.results.total}`} />
            </div>

            <NavPagination
               currentPage={pagination.pages.current}
               isFetching={isLoading}
               limit={pagination.results.limit}
               onChangeLimit={onChangeLimit}
               setCurrentPageToNextPage={() => {
                  setPages({ current: pagination.pages.current + 1 });
               }}
               setCurrentPageToPreviousPage={() => {
                  setPages({ current: pagination.pages.current - 1 });
               }}
               setPages={setPages}
               totalPages={pagination.pages.total}
               totalResults={pagination.results.total}
            />
         </div>

         {/* ADD NOTE FORM */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {
               showForm_AddNote &&
               <FormAddNote hideForm={() => setShowForm_AddNote(false)} jobID={selectedJob._id} />
            }
         </AnimatePresence>

         {/* LIST OF JOBS */}
         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <FadeInList items={
                  jobs.map(job => (
                     <JobDetails
                        job={job}
                        showForm_AddNote={() => {
                           setSelectedJob(job);
                           setShowForm_AddNote(true);
                        }}
                        restrictInfo={true}
                     />
                  ))
               } />
            }
         </AnimatePresence>

         {/* LOADING INDICATOR SPINNER */}
         <AnimatePresence mode='wait'>
            {isLoading && <LoadingDocuments />}
         </AnimatePresence>

         {
            error &&
            <ErrorAlert message={error.message} />
         }
      </>
   );
};

export default Jobs; 