import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useGetJobs } from '../hooks/useGetJobs';

// components
import AddDocumentButton from '../components/AddDocumentButton';
import CreateJobForm from '../components/CreateJobForm';
import DeleteForm from '../components/DeleteForm';
import EditJobForm from '../components/EditJobForm';
import ErrorAlert from '../components/ErrorAlert';
import FadeInList from '../components/FadeInList';
import FormAddNote from '../components/FormAddNote';
import JobDetails from '../components/JobDetails';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import SmallHeader from '../components/SmallHeader';

const Dispatch = ({
   filters,
   pagination,
   setFilters,
   setPagination
}) => {
   const { getJobs, error, isLoading } = useGetJobs();
   const { jobs, dispatch } = useJobsContext();

   // forms
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

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
         filters,
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
         <div className='d-flex flex-column gap-3 my-3 px-3 sticky-top'>
            <div className='d-flex'>
               {/* Display the total amount of search results */}
               <div className='mt-auto me-auto text-secondary'>
                  <SmallHeader text={`Total: ${pagination.results.total}`} />
               </div>

               <AddDocumentButton handleClick={() => setShowCreateForm(true)} />
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
            />
         </div>

         {/* ADD NOTE FORM */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {
               showForm_AddNote &&
               <FormAddNote hideForm={() => setShowForm_AddNote(false)} jobID={selectedJob._id} />
            }
         </AnimatePresence>

         {/* CREATE FORM */}
         <AnimatePresence>
            {
               showCreateForm &&
               <CreateJobForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         {/* EDIT FORM */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {
               showEditForm &&
               <EditJobForm currentJob={selectedJob} hideForm={() => setShowEditForm(false)} />
            }
         </AnimatePresence>

         {/* DELETE FORM */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='jobs'
                  deleteFromContext={deletedJob => dispatch({ type: 'DELETE_JOB', payload: deletedJob })}
                  documentID={selectedJob._id}
                  hideForm={() => setShowDeleteForm(false)}
                  warning={
                     selectedJob.notes.some(note => note.attachments.length > 0) ?
                        'Deleting this job will also delete all attachments in its notes.' :
                        null
                  }
               />
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
                        showDeleteForm={() => {
                           setSelectedJob(job);
                           setShowDeleteForm(true);
                        }}
                        showEditForm={() => {
                           setSelectedJob(job);
                           setShowEditForm(true);
                        }}
                        restrictInfo={false}
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

export default Dispatch; 