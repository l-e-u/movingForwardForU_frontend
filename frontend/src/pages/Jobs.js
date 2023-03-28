import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// hooks
import { useJobsContext } from '../hooks/useJobsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

// components
import ActionButton from '../components/ActionButton.js';
import CreateJobForm from '../components/CreateJobForm.js';
import DeleteConfirmation from '../components/DeleteConfirmation.js';
import EditJobForm from '../components/EditJobForm.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import FilterAndASort from '../components/FilterAndSort.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import JobCard from '../components/JobCard.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import NavPagination from '../components/NavPagination.js';
import OptionsMenu from '../components/OptionsMenu.js';
import PageContentWrapper from '../components/PageContentWrapper.js';

// functions
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { urlQueryString } from '../utils/StringUtils.js';

const Jobs = ({ filters, setFilters }) => {
    const { user } = useAuthContext()
    const { jobs, dispatch } = useJobsContext();

    // used during fetching
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    // sets when user clicks on an option menu, then user can choose one of the options
    const [selectedJobId, setSelectedJobId] = useState(null);

    // user can select certain jobs (or all jobs) to have exported or deleteMany
    const [selectedJobs, setSelectedJobs] = useState([]);

    // sets when user selects menu or option, displays corresponding form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    // pagination state
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // fetches results as the user chooses filters or changes limits for results
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const filterQuery = urlQueryString(filters);

            const response = await fetch(`/api/jobs?page=${currentPage}&limit=${limit}${filterQuery}`, {
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
                setError(null);
                setIsLoading(false);
                setTotalPages(json.totalPages);
                setTotalResults(json.count);
                dispatch({ type: 'SET_JOBS', payload: json.results });

            };
        })();
    }, [currentPage, dispatch, filters, limit, user]);

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
    const hideAllMenusAndForms = () => [setShowEditForm, setShowCreateForm, setShowOptionsMenu, setShowDeleteConfirmation].forEach(setShow => setShow(false));

    return (
        <PageContentWrapper>
            <div className='d-flex flex-column gap-2 mb-3'>
                {showCreateForm ?
                    <CreateJobForm setShowThisForm={setShowCreateForm} /> :
                    // show the options show the create Job Form or to export the job list to excel
                    <div className='d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-end'>
                        {(!showCreateForm && !showEditForm && !showDeleteConfirmation) &&
                            <div className='order-last order-sm-first'>
                                <ActionButton
                                    handleOnClick={() => {
                                        if (!isLoading) exportToExcel();
                                    }}
                                    text='Export Listed Jobs'
                                />
                            </div>
                        }
                        {/* option to show the create Job Form */}
                        <div className='order-first order-sm-last'>
                            <ActionButton
                                handleOnClick={() => {
                                    if (!isLoading) {
                                        hideAllMenusAndForms();
                                        setShowCreateForm(true);
                                        setSelectedJobId(null);
                                    }
                                }}
                                text='Create a Job'
                            />
                        </div>
                    </div>
                }

                {/* user can select pagination page and limit for results */}
                <NavPagination
                    currentPage={currentPage}
                    limit={limit}
                    setCurrentPage={setCurrentPage}
                    setLimit={setLimit}
                    setTotalPages={setTotalPages}
                    totalPages={totalPages}
                    totalResults={totalResults}
                />

                <FilterAndASort filters={filters} setFilters={setFilters} userIsAdmin={true} />
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {(jobs && !isLoading) &&
                <FlexBoxWrapper>
                    {/* show a message when the results have loaded and there's not results */}
                    {(totalResults === 0) &&
                        <div className='outline shadow-sm background-white p-3 text-center'>There are no results.</div>
                    }

                    {/* each elements has the option to show the job, edit form, or delete confirmation depending on the user's selection */}
                    {jobs.map((job) => {
                        const { _id } = job;
                        const isSelectedJob = selectedJobId === _id;

                        // by default, an overview of the model is displayed, unless the user clicks on an option
                        switch (true) {
                            case (showEditForm && isSelectedJob):
                                return (<div className='position-relative' key={_id}>
                                    <EditJobForm prevJob={job} setShowThisForm={setShowEditForm} />
                                </div>);

                            case (showDeleteConfirmation && isSelectedJob):
                                return (<div className='position-relative' key={_id}>
                                    <DeleteConfirmation
                                        dispatch={dispatch}
                                        doc_id={_id}
                                        model='JOB'
                                        route='jobs'
                                        setShowThisForm={setShowDeleteConfirmation}
                                    />
                                </div>)

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        showMenu={showOptionsMenu && isSelectedJob}
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickDeleteOption={() => {
                                            hideAllMenusAndForms();
                                            setShowDeleteConfirmation(true);
                                        }}
                                        handleOnClickEditOption={() => {
                                            hideAllMenusAndForms();
                                            setShowEditForm(true);
                                        }}
                                        handleOnClickMenu={() => {
                                            hideAllMenusAndForms();
                                            setSelectedJobId(_id);
                                            setShowOptionsMenu(true);
                                        }}
                                    />
                                    <JobCard
                                        {...job}
                                        listBilling={true}
                                        listDrivers={true}
                                        listMileage={true}
                                        showCreatedDetails={true}
                                    />
                                </div>);
                        }
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Jobs; 