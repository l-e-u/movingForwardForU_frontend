import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';


// hooks
import { useGetJobs } from '../hooks/useGetJobs';
import { useJobsContext } from '../hooks/useJobsContext';

// components
import FadeInList from '../components/FadeInList';
import ArchiveDetails from '../components/ArchiveDetails';
import JobDetails from '../components/JobDetails';

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

   const [selectedArchive, setSelectedArchive] = useState(null);

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