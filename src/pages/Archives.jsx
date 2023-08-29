import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';


// hooks
import { useGetJobs } from '../hooks/useGetJobs';
import { useJobsContext } from '../hooks/useJobsContext';

// components
import FadeInList from '../components/FadeInList';
import JobDetails from '../components/JobDetails';
import NavPagination from '../components/NavPagination';
import SmallHeader from '../components/SmallHeader';

const Archives = ({
   filters,
   pagination,
   setFilters,
   setPagination
}) => {
   const { jobs } = useJobsContext();
   const { getJobs, error, isLoading } = useGetJobs();

   // form
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);
   const [showFilters, setShowFilters] = useState(false);
   const [selectedArchive, setSelectedArchive] = useState(null);

   // the filter selection offers a way to quickly set pre-selected date ranges depending on the button clicked
   const [quickDateSelections, setQuickDateSelections] = useState({
      pickup: null,
      delivery: null,
      created: null
   });

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
            isArchived: true,
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
         <div className='d-flex flex-column gap-3 px-3 my-3'>
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
               <FormAddNote hideForm={() => setShowForm_AddNote(false)} jobID={selectedArchive._id} />
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <FadeInList items={
                  jobs.map(archive => (
                     <JobDetails
                        job={archive}
                        showForm_AddNote={() => {
                           setSelectedArchive(archive);
                           setShowForm_AddNote(true);
                        }}
                        restrictInfo={true}
                     />
                  ))
               } />
            }
         </AnimatePresence>
      </>
   );
};

export default Archives;