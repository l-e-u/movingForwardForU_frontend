import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import CreateJobForm from '../components/CreateJobForm'
import JobsList from '../components/JobsList';
import Page from '../components/Page';

// utilities
import { urlQueryString } from '../utils/StringUtils';

const Jobs = ({
   filters,
   selectedLink,
   setFilters,
   setSelectedLink,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;

   // user can click on a job from the list below and set the selectedJob which is used to fill the information for the JobDetails component
   const [selectedJob, setSelectedJob] = useState(null);

   // context
   const { user } = useAuthContext()
   const { jobs, dispatch } = useJobsContext();

   const editFormRef = useRef(null);

   // used during fetching
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   // sets when user clicks on an option menu, then user can choose one of the options
   const [selectedJobId, setSelectedJobId] = useState(null);

   // sets when user selects menu or option, displays corresponding form
   const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);
   const [showOptionsMenu, setShowOptionsMenu] = useState(false);

   // pagination state
   const [limit, setLimit] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalResults, setTotalResults] = useState(0);

   // button to add new documents classes, styles, and framer-motion variants
   const addButtonClasses = 'border-0 px-5 py-1 my-3 ms-auto position-relative rounded d-flex justify-content-center align-items-center';
   const addButtonStyles = { backgroundColor: 'var(--mainPalette9)', color: 'var(--mainPalette4)' };
   const addButtonVariants = {
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette9)',
      }
   };

   // fetches results as the user chooses filters or changes limits for results
   useEffect(() => {
      const timeout = setTimeout(async () => {
         setIsLoading(true);
         setError(null);

         const filterQuery = urlQueryString(filters);

         const response = await fetch(`${API_BASE_URL}/api/jobs?page=${currentPage}&limit=${limit}${filterQuery}`, {
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
            console.log('count:', json.count, 'totalPages:', json.totalPages);
            setError(null);
            setIsLoading(false);
            setTotalPages(json.totalPages);
            setTotalResults(json.count);
            dispatch({ type: 'SET_JOBS', payload: json.results });

         };
      }, 250);

      return () => clearTimeout(timeout);
   }, [API_BASE_URL, currentPage, dispatch, filters, limit, user]);

   return (
      <Page selectedLink={selectedLink} setSelectedLink={setSelectedLink}>

         {/* form to add a new job */}
         <CreateJobForm hideForm={() => setShowCreateForm(false)} refreshJobList={() => setFilters(prev => ({ ...prev }))} showForm={showCreateForm} />

         {/* button to display the new job form */}
         <div className='px-3'>
            <motion.button
               className={addButtonClasses}
               style={addButtonStyles}
               onClick={() => setShowCreateForm(true)}
               type='button'
               variants={addButtonVariants}
               whileHover='onHover'
            >
               <i className='bi bi-plus'></i>
            </motion.button>

            <JobsList jobs={jobs} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
         </div>
      </Page>
   );
};

export default Jobs; 