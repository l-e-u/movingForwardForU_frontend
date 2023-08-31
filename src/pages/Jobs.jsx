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
import FilterAndASort from '../components/FilterAndSort';
import FilterButton from '../components/FilterButton';
import FormAddNote from '../components/FormAddNote';
import FormArchive from '../components/FormArchive';
import JobCard from '../components/JobCard';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import SmallHeader from '../components/SmallHeader';

const Jobs = ({
   filters,
   filters_quickDateSelections,
   pagination,
   permissions,
   setFilters,
   setFilters_quickDateSelections,
   setPagination,
   subPath,
}) => {
   const { getJobs, error, isLoading } = useGetJobs(subPath ? subPath : '');
   const { jobs, dispatch } = useJobsContext();

   // booleans to determine what forms to show
   const [showForm_AddNote, setShowForm_AddNote] = useState(false);
   const [showForm_Archive, setShowForm_Archive] = useState(false);
   const [showForm_Create, setShowForm_Create] = useState(false);
   const [showForm_Delete, setShowForm_Delete] = useState(false);
   const [showForm_Edit, setShowForm_Edit] = useState(false);

   // boolean to show the filter options
   const [showFilters, setShowFilters] = useState(false);

   const [jobResults, setJobResults] = useState([]);

   // sets the job to have a note added, archived, deleted, or edited
   const [selectedJob, setSelectedJob] = useState(null);

   const getAdditionalOptions = (job) => {
      const options = [];

      if (permissions.canArchive) {
         options.push({
            name: 'Archive',
            icon: 'archive',
            handler: () => {
               setSelectedJob(job);
               setShowForm_Archive(true);
            }
         });
      };

      if (permissions.canDelete) {
         options.push({
            name: 'Delete',
            icon: 'trash3',
            handler: () => {
               setSelectedJob(job);
               setShowForm_Delete(true);
            }
         });
      };

      if (permissions.canEdit) {
         options.push({
            name: 'Edit',
            icon: 'pen',
            handler: () => {
               setSelectedJob(job);
               setShowForm_Edit(true);
            }
         });
      };

      if (permissions.canAddNote) {
         options.push({
            name: 'Note',
            icon: 'sticky',
            handler: () => {
               setSelectedJob(job);
               setShowForm_AddNote(true);
            }
         });
      };

      return options;
   };

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

   // once fetched, set the results to list
   useEffect(() => setJobResults(jobs), [jobs]);

   // fetch results and set jobResults
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
            });
         }
      });
   }, [filters, pagination.pages.current, pagination.results.limit]);

   return (
      <>
         <div className='my-3 px-3'>
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

            <div className='d-flex gap-3 mt-3'>
               {permissions.canCreate && <AddDocumentButton handleClick={() => setShowForm_Create(true)} />}

               <FilterButton handleClick={() => setShowFilters(true)} />

               {/* Display the total amount of search results */}
               <div className='mt-auto ms-auto text-secondary'>
                  <SmallHeader text={`Total: ${pagination.results.total}`} />
               </div>
            </div>
         </div>

         {/* ERROR MESSAGE */}
         {
            error &&
            <div className='mx-3'>
               <ErrorAlert message={error.message} />
            </div>
         }

         {/* FILTER SELECTION */}
         <AnimatePresence>
            {
               showFilters &&
               <FilterAndASort
                  {...permissions}
                  clearFilters={() => {
                     setFilters({});
                     setFilters_quickDateSelections({
                        pickup: null,
                        delivery: null,
                        created: null
                     });
                  }}
                  filters={filters}
                  hideForm={() => setShowFilters(false)}
                  isFetching={isLoading}
                  quickDateSelections={filters_quickDateSelections}
                  setQuickDateSelection={selection => {
                     setFilters_quickDateSelections({
                        ...filters_quickDateSelections,
                        ...selection
                     })
                  }}
                  setFilters={setFilters}
               />
            }
         </AnimatePresence>

         {/* -------------- FORMS -------------- */}
         <AnimatePresence onExitComplete={() => setSelectedJob(null)}>
            {/* ARCHIVE FORM */}
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
               showForm_Create &&
               <CreateJobForm hideForm={() => setShowForm_Create(false)} />
            }

            {/* EDIT FORM */}
            {
               showForm_Edit &&
               <EditJobForm currentJob={selectedJob} hideForm={() => setShowForm_Edit(false)} />
            }

            {/* DELETE FORM */}
            {
               showForm_Delete &&
               <DeleteForm
                  apiRouteName='jobs'
                  deleteFromContext={deletedJob => dispatch({ type: 'DELETE_JOB', payload: deletedJob })}
                  documentID={selectedJob._id}
                  hideForm={() => setShowForm_Delete(false)}
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
               <FadeInList
                  items={
                     jobResults.map(job => (
                        <JobCard
                           {...permissions}
                           job={job}
                           documentActions={getAdditionalOptions(job)}
                        />
                     ))
                  }
               />
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