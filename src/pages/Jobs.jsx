import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useGetJobs } from '../hooks/useGetJobs';

// components
import JobDetails from '../components/JobDetails';
import LoadingDocuments from '../components/LoadingDocuments';
import FormAddNote from '../components/FormAddNote';

const Jobs = ({
   filters,
   setFilters,
}) => {
   const { user } = useAuthContext();
   const { jobs } = useJobsContext();

   const { getJobs, error, isLoading } = useGetJobs();

   // form
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);

   const [selectedJob, setSelectedJob] = useState(null);

   // pagination state
   const [limit, setLimit] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalResults, setTotalResults] = useState(0);

   // styling for the list container
   const listClasses = 'jobsList pt-3 px-3 pb-0 px-md-5';
   const listVariants = {
      mount: {
         listStyle: 'none',
         margin: '0',
         padding: '0'
      },
      animation: {
         transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1
         }
      }
   };

   // styling for an item in the list
   const itemVariants = {
      mount: {
         opacity: 0,
         marginBottom: '0'
      },
      animation: {
         opacity: 1,
         marginBottom: '1rem',
         transition: {
            marginBottom: {
               delay: 0.5
            }
         }
      }
   };

   // fetches results as the user chooses filters or changes limits for results
   useEffect(() => {
      getJobs({
         currentPage,
         limit,
         filters: {
            ...filters,
            drivers: [user._id]
         }
      });
   }, [currentPage, filters, limit]);

   return (
      <>
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
               <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
                  {
                     jobs.map(job => (
                        <motion.li key={job._id} variants={itemVariants}>
                           {/* drivers can only access this page and get restricted info version of the job detials */}
                           <JobDetails
                              job={job}
                              // showEditForm={() => setSelectedJob(job)} 
                              showForm_AddNote={() => {
                                 setSelectedJob(job);
                                 setShowForm_AddNote(true);
                              }}
                              restrictInfo={true}
                           />
                        </motion.li>
                     ))
                  }
               </motion.ul>
            }
         </AnimatePresence>

         {/* LOADING INDICATOR SPINNER */}
         <AnimatePresence mode='wait'>
            {isLoading && <LoadingDocuments />}
         </AnimatePresence>
      </>
   );
};

export default Jobs; 