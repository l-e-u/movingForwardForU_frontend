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
import FilterButton from '../components/FilterButton';
import FilterAndASort from '../components/FilterAndSort';
import { useDebounce } from '../hooks/useDebounce';
import FormArchive from '../components/FormArchive';

const Dispatch = ({
   filters,
   pagination,
   setFilters,
   setPagination
}) => {
   const { getJobs, error, isLoading } = useGetJobs();
   const { jobs, dispatch } = useJobsContext();

   // debounces the user's filter selecti{ons to prevent api calls on every key stroke
   const debounced_filters = useDebounce({ value: filters, seconds: 1 });

   // forms
   const [showForm_Archive, setShowForm_Archive] = useState(false);
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [showFilters, setShowFilters] = useState(false);

   const [selectedJob, setSelectedJob] = useState(null);

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
            isArchived: false
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
   }, [pagination.results.limit, pagination.pages.current, debounced_filters]);

   return (
      <>
         <div className='d-flex flex-column gap-3 my-3 px-3'>
            <div className='d-flex gap-3'>
               {/* Display the total amount of search results */}
               <div className='flex-grow-1 mt-auto me-auto text-secondary'>
                  <SmallHeader text={`Total: ${pagination.results.total}`} />
               </div>
               <FilterButton handleClick={() => setShowFilters(true)} />
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

         {/* FILTER SELECTION */}
         <AnimatePresence>
            {
               showFilters &&
               <FilterAndASort
                  clearFilters={() => {
                     setFilters({});
                     setQuickDateSelections({
                        pickup: null,
                        delivery: null,
                        created: null
                     });
                  }}
                  filters={filters}
                  hideForm={() => setShowFilters(false)}
                  quickDateSelections={quickDateSelections}
                  setQuickDateSelection={selection => {
                     setQuickDateSelections({
                        ...quickDateSelections,
                        ...selection
                     })
                  }}
                  setFilters={setFilters}
               />
            }
         </AnimatePresence>

         {/* -------------- FORMS -------------- */}

         {/* ARCHIVE FORM */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {
               showForm_Archive &&
               <FormArchive jobID={selectedJob._id} hideForm={() => setShowForm_Archive(false)} />
            }

            {/* ADD NOTE FORM */}
            {
               showForm_AddNote &&
               <FormAddNote hideForm={() => setShowForm_AddNote(false)} jobID={selectedJob._id} />
            }

            {/* CREATE FORM */}
            {
               showCreateForm &&
               <CreateJobForm hideForm={() => setShowCreateForm(false)} />
            }

            {/* EDIT FORM */}
            {
               showEditForm &&
               <EditJobForm currentJob={selectedJob} hideForm={() => setShowEditForm(false)} />
            }

            {/* DELETE FORM */}
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

         {/* -------------- JOBS -------------- */}
         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <FadeInList items={
                  jobs.map(job => (
                     <JobDetails
                        job={job}
                        showForm_Archive={() => {
                           setSelectedJob(job);
                           setShowForm_Archive(true);
                        }}
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