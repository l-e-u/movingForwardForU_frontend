import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// hooks
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useJobsContext } from '../hooks/useJobsContext.js';

// components
import JobCard from '../components/JobCard.js';
import CreateJobForm from '../components/CreateJobForm.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import EditJobForm from '../components/EditJobForm.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ActionButton from '../components/ActionButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import OptionsMenu from '../components/OptionsMenu.js';

const Jobs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    const { user } = useAuthContext();
    const { jobs, dispatch } = useJobsContext();

    // get jobs once
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/jobs', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all fees
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                dispatch({ type: 'SET_JOBS', payload: json });
            };
        })();
    }, []);

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

    return (
        <PageContentWrapper>
            {showCreateForm ?
                <CreateJobForm setShowThisForm={setShowCreateForm} /> :
                <ActionButton
                    alignX='right'
                    handleOnClick={() => {
                        setShowCreateForm(true);
                        setShowEditForm(false);
                        setShowOptionsMenu(false);
                        setSelectedJobId(null);
                    }}
                    text='Create a Job'
                />
            }


            {/* exports the current jobs listed */}
            <div className='py-3'>
                <ActionButton
                    alignX='right'
                    handleOnClick={exportToExcel}
                    text='Export Listed Jobs'
                />
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {jobs &&
                <FlexBoxWrapper>
                    {jobs.map((job) => {
                        const { _id } = job;
                        const isSelectedJob = selectedJobId === _id;

                        switch (true) {
                            case (showEditForm && isSelectedJob):
                                return (<div className='position-relative' key={_id}>
                                    <EditJobForm prevJob={job} setShowThisForm={setShowEditForm} />
                                </div>);

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        showMenu={showOptionsMenu && isSelectedJob}
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickEditOption={() => {
                                            setShowEditForm(true);
                                            setShowCreateForm(false);
                                            setShowOptionsMenu(false);
                                        }}
                                        handleOnClickMenu={() => {
                                            setSelectedJobId(_id);
                                            setShowOptionsMenu(true);
                                        }}
                                    />
                                    <JobCard
                                        {...job}
                                        listDrivers={true}
                                        listFees={true}
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