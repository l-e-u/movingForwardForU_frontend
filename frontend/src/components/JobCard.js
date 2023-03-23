// components
import AddressDisplay from './AddressDisplay';
import Card from './Card'
import CreatedInfo from './CreatedInfo';
import DriversList from './DriversList';
import FeesList from './FeesList';
import NotesList from './NotesList';
import SmallHeader from './SmallHeader';

// functions
import { formatCurrency } from '../utils/StringUtils';

const JobCard = ({
    createdAt,
    createdBy,
    customer,
    delivery,
    drivers,
    fees,
    mileage,
    notes,
    pickup,
    parcel,
    reference,
    status,
    listDrivers = false,
    listFees = false,
    listMileage = false,
    showCreatedDetails = false,
}) => {
    const hasDrivers = drivers.length > 0;
    const hasFees = fees.length > 0;
    const hasNotes = notes.length > 0;

    return (
        <Card
            header={<>
                <div className='mb-2'>{status.name}</div>
                <div className='d-flex flex-wrap justify-content-between gap-2'>
                    <h2 className='fs-5 m-0'>{customer.organization}</h2>
                    {reference && <small className='text-action text-end align-self-end flex-grow-1'>{reference}</small>}
                </div>
            </>}

            body={<div className='d-flex flex-column gap-2'>
                {listDrivers &&
                    <div>
                        <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                        {hasDrivers ? <DriversList list={drivers} /> : <div>No drivers have been assigned.</div>}
                    </div>
                }


                {/* pickup and delivery addresses */}
                <div className='d-flex flex-column flex-md-row justify-content-between gap-4'>
                    <AddressDisplay
                        address={pickup.address}
                        date={pickup.date}
                        includeTime={pickup.includeTime}
                        heading='Pickup'
                    />
                    <AddressDisplay
                        address={delivery.address}
                        date={delivery.date}
                        includeTime={delivery.includeTime}
                        alignEnd={true}
                        heading='Delivery'
                    />
                </div>

                <hr className='m-0' />

                {/* parcel and mileage */}
                <div className='d-flex flex-column gap-2 flex-sm-row justify-sm-content-between'>
                    {parcel &&
                        <div className='flex-grow-1'>
                            <SmallHeader text='Parcel' />
                            {parcel}
                        </div>
                    }
                    {listMileage &&
                        <div className={'flex-grow-1' + (parcel ? ' text-end' : '')}>
                            <SmallHeader text='Mileage' />
                            {mileage}
                        </div>
                    }
                </div>
                <div className='d-lg-flex gap-lg-5'>
                    {listFees &&
                        <div className='w-lg-50 order-lg-last'>
                            <SmallHeader text={'Fee' + ((fees.length > 1) ? 's' : '')} />
                            {hasFees && <>
                                <FeesList list={fees} />
                                <div className='d-flex align-items-center justify-content-end mt-1'>
                                    <SmallHeader text='Total' />
                                    <span className='border-top ms-2 ps-2'>{'$ ' + formatCurrency(fees.reduce((total, f) => total + f.amount, 0), true)}</span>
                                </div>
                            </>}

                            {!hasFees && <div>No fees has been assessed.</div>}
                        </div>
                    }

                    <div className={'order-lg-first' + (listFees ? ' w-lg-50' : ' flex-grow-1')}>
                        <SmallHeader text={'Note' + ((notes.length > 1) ? 's' : '')} />
                        {hasNotes ? <NotesList list={notes} /> : <div>No notes have been appended.</div>}
                    </div>
                </div>
            </div>}

            footer={showCreatedDetails && <CreatedInfo createdBy={createdBy} createdAt={createdAt} />}
        />
    );
};

export default JobCard;