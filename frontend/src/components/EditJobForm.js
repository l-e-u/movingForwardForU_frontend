import { useState } from 'react';
import { useUpdateJob } from '../hooks/useUpdateJob.js';

// functions
import { noCharChanges } from '../utils/StringUtils.js';

// components
import JobForm from './JobForm';
import FormHeader from './FormHeader';
import CloseFormButton from './XButton';

const EditJobForm = ({ prevJob, setShowThisForm }) => {
    const { updateJob, error, isLoading } = useUpdateJob();
    const [job, setJob] = useState(prevJob);
    const updatedJob = {};

    // user cannot update a doc that has not character changes, this disables the update button
    const statusHasChanged = !noCharChanges(prevJob.status._id, job.status._id);
    const contactHasChanged = !noCharChanges(prevJob.customer._id, job.customer._id ?? '');
    const referenceHasChanged = !noCharChanges(prevJob.reference, job.reference);
    const parcelHasChanged = !noCharChanges(prevJob.parcel, job.parcel);
    const pickupAddressHasChanged = !noCharChanges(prevJob.pickup.address, job.pickup.address);
    const deliveryAddressHasChanged = !noCharChanges(prevJob.delivery.address, job.delivery.address);

    const noInputChanges = !statusHasChanged && !contactHasChanged && !referenceHasChanged && !parcelHasChanged && !pickupAddressHasChanged && !deliveryAddressHasChanged;

    // function compareObjects(obj1, obj2) {
    //     let diffs = {};

    //     for (let prop in obj1) {
    //         if (typeof obj1[prop] === 'object' && typeof obj2[prop] === 'object') {
    //             let nestedDiffs = compareObjects(obj1[prop], obj2[prop]);
    //             if (Object.keys(nestedDiffs).length > 0) {
    //                 diffs[prop] = nestedDiffs;
    //             }
    //         } else if (obj1[prop] !== obj2[prop]) {
    //             diffs[prop] = [obj1[prop], obj2[prop]];
    //         }
    //     }

    //     return diffs;
    // };

    console.log('prev cust:', prevJob.customer._id)
    console.log('curr cust:', job.customer._id)

    return (
        <div>
            <FormHeader text='Edit Job'>
                <CloseFormButton handleOnClick={() => setShowThisForm(false)} />
            </FormHeader>

            <JobForm
                job={job}
                setJob={setJob}
                error={error}
                isDisabled={isLoading || noInputChanges}
                handleSubmit={async (e) => {
                    e.preventDefault();

                    await updateJob({
                        _id: prevJob._id,
                        job: undefined
                    })
                        .then(isCreated => {
                            if (isCreated) setShowThisForm(false);
                        })
                }} />
        </div>
    );
};

export default EditJobForm;