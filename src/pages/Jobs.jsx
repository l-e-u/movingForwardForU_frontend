import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from 'xlsx';

// hooks
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import ActionButton from '../components/ActionButton';
import CreateJobForm from '../components/CreateJobForm'
import DeleteConfirmation from '../components/DeleteConfirmation'
import EditJobForm from '../components/EditJobForm';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments';
import FilterAndASort from '../components/FilterAndSort';
import FlexBoxWrapper from '../components/FlexBoxWrapper';
import JobCard from '../components/JobCard';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import OptionsMenu from '../components/OptionsMenu';
import PageContentWrapper from '../components/Page';

// functions
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { urlQueryString } from '../utils/StringUtils';
import ArchiveConfirmation from '../components/ArchiveConfirmation';
import Page from '../components/Page';
import JobDetails from '../components/JobDetails';
import JobsList from '../components/JobsList';

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
   const addButtonClasses = 'border-0 px-3 py-1 ms-auto position-relative rounded d-flex justify-content-center align-items-center';
   const addButtonStyles = { backgroundColor: 'var(--mainPalette3)', color: 'white' };
   const addButtonVariants = {
      onHover: {
         scale: 1.1,
         transition: {
            duration: 0.3,
         },
         boxShadow: '0px 0px 8px var(--mainPalette3)',
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

   useEffect(() => {
      if (showEditForm) editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [showEditForm]);

   const exportToExcel = () => {
      const dataSet = jobs.map(job => {
         const pickupDate = new Date(job.pickup.date);
         const deliveryDate = new Date(job.delivery.date);
         const pickupTime = job.pickup.includeTime ? String(pickupDate.getHours()).padStart(2, '0') + String(pickupDate.getMinutes()).padStart(2, '0') : '';
         const deliveryTime = job.delivery.includeTime ? String(deliveryDate.getHours()).padStart(2, '0') + String(deliveryDate.getMinutes()).padStart(2, '0') : '';
         let driversString = '';
         let notesString = '';

         job.drivers.forEach((driver, index, arr) => {
            driversString += driver.lastName + ', ' + driver.firstName;
            if (arr[index + 1]) driversString += ';\n';
         });

         job.notes.forEach((note, index, arr) => {
            notesString += `[${note.subject}]\n${note.message}\n<${new Date(note.createdAt).toString()} by ${note.createdBy.firstName} ${note.createdBy.lastName}>`;
            if (arr[index + 1]) notesString += ';\n';
         });

         return {
            'Reference#': job.reference,
            'Status ID': job.status._id,
            'Status': job.status.name,
            'Customer ID': job.customer._id,
            'Customer': job.customer.organization,
            'Drivers': driversString,
            'Parcel': job.parcel,
            'Mileage': job.mileage,
            'Pickup Address': job.pickup.address,
            'Delivery Address': job.delivery.address,
            'Pickup Date': pickupDate,
            'Pickup Time': pickupTime,
            'Delivery Date': deliveryDate,
            'Delivery Time': deliveryTime,
            'Notes': notesString,
         }
      });

      // set the max column width default
      const maxColWidth = Array(Object.keys(dataSet[0]).length).fill().map(() => ({ wch: 15 }));

      dataSet.forEach(row => {
         Object.values(row).forEach((value, index) => {
            // skip date objects
            if (typeof value === 'object') return;
            maxColWidth[index].wch = Math.max(maxColWidth[index].wch, value.length);
         });
      });

      // create the worksheet with the dataset
      const worksheet = XLSX.utils.json_to_sheet(dataSet, { cellDates: true, dateNF: 'YYYY-MM-DD' });

      worksheet['!cols'] = maxColWidth;

      // create a new workbook
      const workbook = XLSX.utils.book_new();

      // name then append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const fileDate = new Date();
      const fileName = `${fileDate.getFullYear()}-${String(fileDate.getMonth() + 1).padStart(2, '0')}-${String(fileDate.getDate()).padStart(2, '0')}_${String(fileDate.getHours()).padStart(2, '0')}${String(fileDate.getMinutes()).padStart(2, '0')}_ExportedJobs.xlsx`;

      // attempt to force download on the browser
      XLSX.writeFile(workbook, fileName);
   };

   // sets all the forms and menus show setters to false
   const hideAllMenusAndForms = () => [setShowArchiveConfirmation, setShowEditForm, setShowCreateForm, setShowOptionsMenu, setShowDeleteConfirmation].forEach(setShow => setShow(false));

   const hasJobs = jobs ? jobs.length > 0 : false;

   return (
      <Page selectedLink={selectedLink} setSelectedLink={setSelectedLink}>
         <AnimatePresence mode='wait' onExitComplete={() => setShowCreateForm(false)}>
            {showCreateForm && <CreateJobForm setShowThisForm={setShowCreateForm} setFilters={setFilters} />}
         </AnimatePresence>

         <AnimatePresence mode='wait' onExitComplete={() => setSelectedJob(null)}>
            {selectedJob && <JobDetails job={selectedJob} setFilters={setFilters} />}
         </AnimatePresence>

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

   //    return (
   //       <PageContentWrapper>
   //          <div className='d-flex flex-column gap-2 mb-3'>
   //             {showCreateForm ?
   //                <CreateJobForm setShowThisForm={setShowCreateForm} setFilters={setFilters} /> :
   //                // show the options show the create Job Form or to export the job list to excel
   //                <div className='d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-end'>
   //                   {(!showCreateForm && !showEditForm && !showDeleteConfirmation) &&
   //                      <div className='order-last order-sm-first'>
   //                         {hasJobs &&
   //                            <ActionButton
   //                               handleOnClick={() => {
   //                                  if (!isLoading) exportToExcel();
   //                               }}
   //                               text='Export Listed Jobs'
   //                            />
   //                         }
   //                      </div>
   //                   }
   //                   {/* option to show the create Job Form */}
   //                   <div className='order-first order-sm-last ms-auto'>
   //                      <ActionButton
   //                         handleOnClick={() => {
   //                            if (!isLoading) {
   //                               hideAllMenusAndForms();
   //                               setShowCreateForm(true);
   //                               setSelectedJobId(null);
   //                            }
   //                         }}
   //                         text='Create a Job'
   //                      />
   //                   </div>
   //                </div>
   //             }

   //             {/* user can select pagination page and limit for results */}
   //             <NavPagination
   //                currentPage={currentPage}
   //                limit={limit}
   //                setCurrentPage={setCurrentPage}
   //                setLimit={setLimit}
   //                setTotalPages={setTotalPages}
   //                totalPages={totalPages}
   //                totalResults={totalResults}
   //             />

   //             <FilterAndASort filters={filters} setFilters={setFilters} userIsAdmin={true} />
   //          </div>

   //          {/* show spinner with actively fetching data */}
   //          {isLoading && <div className='my-5'><LoadingDocuments /></div>}

   //          {error && <ErrorLoadingDocuments docType='Jobs' />}

   //          {(jobs && !isLoading) &&
   //             <FlexBoxWrapper>
   //                {/* show a message when the results have loaded and there's not results */}
   //                {(totalResults === 0) &&
   //                   <div className='outline shadow-sm background-white p-3 text-center'>There are no results.</div>
   //                }

   //                {/* each elements has the option to show the job, edit form, or delete confirmation depending on the user's selection */}
   //                {jobs.map((job) => {
   //                   const { _id } = job;
   //                   const isSelectedJob = selectedJobId === _id;

   //                   // by default, an overview of the model is displayed, unless the user clicks on an option
   //                   switch (true) {
   //                      case (showArchiveConfirmation && isSelectedJob):
   //                         return (<div className='position-relative' key={_id}>
   //                            <ArchiveConfirmation job={job} setShowThisForm={setShowArchiveConfirmation} callBack={() => setTotalResults(prev => prev - 1)} />
   //                         </div>);

   //                      case (showEditForm && isSelectedJob):
   //                         return (<div className='position-relative' key={_id} ref={editFormRef}>
   //                            {/* the call back is to trigger a fetch for updated jobs list */}
   //                            <EditJobForm prevJob={job} setShowThisForm={setShowEditForm} callBack={() => setFilters(prev => ({ ...prev }))} />
   //                         </div>);

   //                      case (showDeleteConfirmation && isSelectedJob):
   //                         return (<div className='position-relative' key={_id}>
   //                            <DeleteConfirmation
   //                               callBack={() => setTotalResults(prev => prev - 1)}
   //                               dispatch={dispatch}
   //                               doc_id={_id}
   //                               message={'Are you sure you want to delete this job?\nThis cannot be undone.'}
   //                               model='JOB'
   //                               route='jobs'
   //                               setShowThisForm={setShowDeleteConfirmation}
   //                            />
   //                         </div>)

   //                      default:
   //                         return (<div className='position-relative' key={_id}>
   //                            <OptionsMenu
   //                               showMenu={showOptionsMenu && isSelectedJob}
   //                               handleOnClickArchiveOption={() => {
   //                                  hideAllMenusAndForms();
   //                                  setShowArchiveConfirmation(true);
   //                               }}
   //                               handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
   //                               handleOnClickDeleteOption={() => {
   //                                  hideAllMenusAndForms();
   //                                  setShowDeleteConfirmation(true);
   //                               }}
   //                               handleOnClickEditOption={() => {
   //                                  hideAllMenusAndForms();
   //                                  setShowEditForm(true);
   //                               }}
   //                               handleOnClickMenu={() => {
   //                                  hideAllMenusAndForms();
   //                                  setSelectedJobId(_id);
   //                                  setShowOptionsMenu(true);
   //                               }}
   //                            />
   //                            <JobCard
   //                               {...job}
   //                               listBilling={true}
   //                               listDrivers={true}
   //                               listMileage={true}
   //                               showCreatedDetails={true}
   //                            />
   //                         </div>);
   //                   }
   //                })}
   //             </FlexBoxWrapper>
   //          }
   //       </PageContentWrapper>
   //    );
};

export default Jobs; 