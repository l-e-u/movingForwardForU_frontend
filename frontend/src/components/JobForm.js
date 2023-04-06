import { useState } from 'react';

// components
import RequiredFieldsText from './RequiredFieldsText';
import StatusSearchSelect from './StatusSearchSelect';
import ContactSearchSelect from './ContactSearchSelect';
import DriverSearchSelect from './UserSearchSelect';
import PickupOrDeliveryInput from './PickupOrDeliveryInput';
import NotesInput from './NotesInput';
import FeeSearchSelect from './FeeSearchSelect';
import ActionButton from './ActionButton'

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const JobForm = ({ job, setJob, handleSubmit, error, setError, isDisabled, isLoading }) => {
    const { status, customer, billing, mileage, reference, parcel, drivers, notes } = job;

    const [isResizingImages, setIsResizingImages] = useState(false);

    const maxUploadSize = 5 * 1024 * 1024; // 5MB

    // filter all notes with attachment's length larger than zero and return only those attachments
    const arrayOfAttachments = notes.filter(note => note.attachments.length > 0).map(note => note.attachments);
    // flatten into an array of all all attachments
    const allAttachments = [].concat(...arrayOfAttachments);
    // filter out only the new files
    const allNewFilesToUpload = allAttachments.filter(attachment => attachment.file);
    const totalSizeOfNewImagesToUpload = allNewFilesToUpload.reduce((total, { file }) => total + file.size, 0);
    const withinUploadSizeLimit = totalSizeOfNewImagesToUpload <= maxUploadSize;

    const errorOther = error?.server;

    return (<>
        <RequiredFieldsText />
        <form onSubmit={handleSubmit}>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-xl-3 col-sm-6 p-0 mb-2 pe-sm-2'>
                        {/* STATUS */}
                        <StatusSearchSelect
                            status={status}
                            setJob={setJob}
                            inputError={error?.status}
                            inputErrorMessage={error?.status?.message}
                        />
                    </div>

                    <div className='col-xl-4 col-sm-6 p-0 mb-2 ps-sm-2 pe-xl-2'>

                        {/* CUSTOMER / CONTACT */}
                        <ContactSearchSelect
                            customer={customer}
                            setJob={setJob}
                            inputError={error?.customer}
                            inputErrorMessage={error?.customer?.message}
                        />
                    </div>

                    <div className='col-xl-3 col-sm-6 p-0 mb-2 pe-sm-2 ps-xl-2'>
                        {/* PARCEL */}
                        <div className='form-floating'>
                            <input
                                type='text'
                                className='form-control'
                                name='parcel'
                                placeholder='Parcel'
                                id='parcel'
                                value={parcel ?? ''}
                                onChange={(e) => {
                                    setJob(prev => {
                                        return {
                                            ...prev,
                                            parcel: e.target.value
                                        }
                                    })
                                }}
                                onBlur={(e) => {
                                    setJob(prev => {
                                        return {
                                            ...prev,
                                            parcel: removeExtraSpaces(e.target.value.trim())
                                        }
                                    })
                                }} />
                            <label htmlFor='parcel' className='form-label'>Parcel</label>
                        </div>
                    </div>

                    <div className='col-xl-2 col-sm-6 p-0 mb-2 ps-sm-2'>
                        {/* REFERENCE */}
                        <div className='form-floating'>
                            <input
                                className='form-control'
                                type='text'
                                name='reference'
                                id='reference'
                                placeholder='Reference #'
                                value={reference ?? ''}
                                onChange={(e) => {
                                    setJob(prev => {
                                        return {
                                            ...prev,
                                            reference: e.target.value
                                        }
                                    })
                                }}
                                onBlur={(e) => {
                                    setJob(prev => {
                                        return {
                                            ...prev,
                                            reference: removeExtraSpaces(e.target.value.trim())
                                        }
                                    })
                                }} />
                            <label htmlFor='reference' className='form-label'>Reference #</label>
                        </div>
                    </div>
                </div>
            </div>


            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-xl-4 p-0 pe-xl-2'>
                        <div className='container-fluid'>
                            <div className='row mb-2'>
                                {/* DRIVERS */}
                                <div className='col-xl-8 col-sm-8 p-0 pe-sm-2 mb-2 mb-sm-0'>
                                    <DriverSearchSelect drivers={drivers} setJob={setJob} />
                                </div>

                                <div className='col-xl-4 col-sm-4 p-0 ps-sm-2'>
                                    {/* MILEAGE */}
                                    <div className='form-floating'>
                                        <input
                                            className={'form-control' + (error?.mileage ? ' is-invalid' : '')}
                                            id='mileage'
                                            name='mileage'
                                            onBlur={e => {
                                                const input = e.target.value;

                                                if (input === '') {
                                                    setJob(prev => {
                                                        return {
                                                            ...prev,
                                                            mileage: 0
                                                        }
                                                    })
                                                }
                                            }}
                                            onChange={e => setJob(prev => {
                                                return {
                                                    ...prev,
                                                    mileage: e.target.value
                                                }
                                            })}
                                            placeholder='Mileage'
                                            step={1}
                                            title='Needs to be a number.'
                                            type='number'
                                            value={mileage}
                                        />
                                        <label htmlFor='mileage' className='form-label'>
                                            Mileage
                                            {error?.mileage && <span className='ms-1 text-danger'>{': ' + error.mileage.message}</span>}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-md-6 p-0 py-0 ps-xl-2 pe-md-2'>
                        {/* PICKUP ADDRESS/TIME */}
                        <PickupOrDeliveryInput
                            isPickup={true}
                            error={error?.['pickup.address']}
                            job={job}
                            setJob={setJob}
                        />
                    </div>
                    <div className='col-xl-4 col-md-6 p-0 py-0 pe-0 ps-md-2 mt-2 mt-md-0'>
                        {/* DELIVERY ADDRESS/TIME */}
                        <PickupOrDeliveryInput
                            isPickup={false}
                            error={error?.['delivery.address']}
                            job={job}
                            setJob={setJob}
                        />
                    </div>
                </div>
            </div>

            <br />

            {/* billing */}
            <FeeSearchSelect billing={billing} setJob={setJob} />

            <br />

            {/* notes */}
            <NotesInput
                error={error}
                isResizingImages={isResizingImages}
                notes={notes} setJob={setJob}
                setError={setError}
                setIsResizingImages={setIsResizingImages}
                withinUploadSizeLimit={withinUploadSizeLimit}
            />

            <div className='mt-4 mt-sm-0'>
                <ActionButton
                    alignX='right'
                    isDisabled={isDisabled || isResizingImages || !withinUploadSizeLimit}
                    isLoading={isLoading}
                    text={(isLoading ? 'Saving...' : 'Save')}
                    type='submit'
                />
            </div>

            {/* any errors other than input validation */}
            {errorOther && <div className='text-danger mt-3 w-100'>{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    </>);
};

export default JobForm;