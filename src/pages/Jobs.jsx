import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useGetJobs } from '../hooks/useGetJobs';

// components
import CreateJobForm from '../components/CreateJobForm';
import JobDetails from '../components/JobDetails';

const Jobs = ({
   filters,
   setFilters,
}) => {
   const { getJobs, error, isLoading } = useGetJobs();
   const { jobs } = useJobsContext();

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [selectedJob, setSelectedJob] = useState(null);

   // pagination state
   const [limit, setLimit] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalResults, setTotalResults] = useState(0);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'px-3 py-1 ms-auto position-relative border-start-0 border-top-0 rounded text-white d-flex justify-content-center align-items-center gap-1';
   const addButtonVariants = {
      mount: {
         backgroundColor: 'var(--mainPalette4)',
         borderRight: '1px solid var(--mainPalette2)',
         borderBottom: '1px solid var(--mainPalette2)'
      },
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette4)',
      }
   };

   // styling for the list container
   const listClasses = 'jobsList px-3 pb-0 px-md-5';
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
         filters
      });
   }, [currentPage, filters, limit]);

   console.log(jobs)

   return (
      <>
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateJobForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         {/* button to display the new job form */}
         <div className='p-2'>
            <motion.button
               className={addButtonClasses}
               onClick={() => setShowCreateForm(true)}
               type='button'
               variants={addButtonVariants}
               initial='mount'
               whileHover='onHover'
            >
               <i className='bi bi-plus'></i>
               <i className='bi bi-truck'></i>
            </motion.button>
         </div>

         <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
            {
               jobs.map(job => (
                  <motion.li key={job._id} variants={itemVariants}>
                     <JobDetails job={job} showEditForm={() => setSelectedJob(job)} />
                  </motion.li>
               ))
            }
         </motion.ul>
      </>
   );
};

export default Jobs; 