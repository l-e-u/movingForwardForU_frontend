import { useState } from 'react';
import { useUpdateJob } from '../hooks/useUpdateJob.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';

const EditJobForm = ({ prevJob, setShowThisForm }) => {
    const { updateJob, error, isLoading, setError } = useUpdateJob();
    const [job, setJob] = useState(prevJob);

    // user cannot update a doc that has not character changes, this disables the update button
    const statusHasChanged = !noCharChanges(prevJob.status._id, job.status?._id ?? '');
    const customerHasChanged = !noCharChanges(prevJob.customer._id, job.customer?._id ?? '');
    const referenceHasChanged = !noCharChanges(prevJob.reference ?? '', job.reference ?? '');
    const parcelHasChanged = !noCharChanges(prevJob.parcel ?? '', job.parcel ?? '');
    const pickupAddressHasChanged = !noCharChanges(prevJob.pickup.address, job.pickup.address ?? '');
    const deliveryAddressHasChanged = !noCharChanges(prevJob.delivery.address, job.delivery.address ?? '');
    const driversHaveChanged = (prevJob.drivers.length !== job.drivers.length) || !prevJob.drivers.every(driver => job.drivers.some(d => driver._id === d._id));
    const logHasChanged = (prevJob.logs.length !== job.logs.length) || !prevJob.logs.every(log => job.logs.some(l => log._id === l._id));

    let pickupInfoHasChanged = false;
    let pickupTimeHasChanged = false;
    let pickupDateHasChanged = false;

    if ((!prevJob.pickup.date && job.pickup.date) || (prevJob.pickup.date && !job.pickup.date)) pickupDateHasChanged = true;
    if ((!prevJob.pickup.includeTime && job.pickup.includeTime) || (prevJob.pickup.includeTime && !job.pickup.includeTime)) pickupTimeHasChanged = true;


    if (prevJob.pickup.date && job.pickup.date) {
        if (prevJob.pickup.date.toString() !== job.pickup.date.toString()) pickupDateHasChanged = true;
    };

    if (pickupDateHasChanged || pickupTimeHasChanged) pickupInfoHasChanged = true;

    const noInputChanges = !statusHasChanged && !customerHasChanged && !referenceHasChanged && !parcelHasChanged && !pickupAddressHasChanged && !deliveryAddressHasChanged && !driversHaveChanged && !logHasChanged && !pickupInfoHasChanged;

    return (
        <div>
            <FormHeader text='Edit Job'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <JobForm
                job={job}
                setJob={setJob}
                setError={setError}
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await updateJob({
                        _id: prevJob._id,
                        job: {
                            status: statusHasChanged ? job.status : undefined,
                            customer: customerHasChanged ? job.customer : undefined,
                            reference: referenceHasChanged ? job.reference : undefined,
                            parcel: parcelHasChanged ? job.parcel : undefined,
                            pickup: pickupInfoHasChanged ? job.pickup : undefined,
                            delivery: deliveryAddressHasChanged ? { address: job.delivery.address } : undefined,
                            drivers: driversHaveChanged ? job.drivers : undefined,
                            logs: logHasChanged ? job.logs : undefined
                        },
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </div>
    );
};

export default EditJobForm;