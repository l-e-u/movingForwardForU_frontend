// components
import AddressDisplay from './AddressDisplay';
import Card from './Card'
import CreatedInfo from './CreatedInfo';
import DriversList from './DriversList';
import FeesList from './FeesList';
import NotesList from './NotesList';
import SmallHeader from './SmallHeader';

const JobCard = ({
    createdAt,
    createdBy,
    customer,
    delivery,
    drivers,
    fees,
    notes,
    pickup,
    parcel,
    reference,
    status,
    listDrivers = false,
    listFees = false,
    showCreatedDetails = false,
}) => {
    const hasDrivers = drivers.length > 0;
    const hasFees = fees.length > 0;

    // these lists are for admins only
    const showDrivers = hasDrivers && listDrivers;
    const showFees = hasFees && listFees;

    return (
        <Card
            header={<>
                <div className='mb-2'>{status.name}</div>
                <div className='d-flex flex-wrap justify-content-between gap-2'>
                    <h2 className='fs-5 m-0'>{customer.organization}</h2>
                    {reference && <small className='text-action text-end align-self-end flex-grow-1'>{reference}</small>}
                </div>
            </>}

            body={<div className='d-flex flex-column gap-3'>
                {!hasDrivers && <div className='text-danger'>No driver has been assigned.</div>}

                {showDrivers &&
                    <div>
                        <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                        <DriversList list={drivers} />
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

                {parcel &&
                    <div>
                        <SmallHeader text='Parcel' />
                        {parcel}
                    </div>
                }

                {showFees &&
                    <div>
                        <SmallHeader text={'Fee' + ((fees.length > 1) ? 's' : '')} />
                        <FeesList list={fees} />
                    </div>
                }

                {notes && <NotesList notes={notes} />}
            </div>}

            footer={showCreatedDetails && <CreatedInfo createdBy={createdBy} createdAt={createdAt} />}
        />
    );
};

export default JobCard;