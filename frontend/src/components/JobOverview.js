// functions
import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

// components
import DriversList from './DriversList';
import NotesList from './NotesList';
import SmallHeader from './SmallHeader';

const JobOverview = ({
    pickup,
    delivery,
    parcel,
    reference,
    status,
    drivers,
    customer,
    notes,
    listDrivers = false
}) => {
    const hasDrivers = drivers.length > 0;
    const showDrivers = hasDrivers && listDrivers;

    return (
        <div className='d-flex flex-column gap-2'>
            <div>{status.name.toUpperCase()}</div>
            <div className='d-flex flex-wrap justify-content-between gap-2'>
                <h2 className='text-primary fs-5 m-0'>{customer.organization}</h2>
                {reference && <small className='text-green text-end align-self-end flex-grow-1'>{reference}</small>}
            </div>

            {!hasDrivers && <div className='text-danger'>No driver has been assigned.</div>}

            {showDrivers &&
                <div>
                    <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                    <DriversList list={drivers} />
                </div>}


            <div>
                <div className='d-flex gap-2'>
                    <SmallHeader text='Pickup' />
                    {pickup.date && <SmallHeader text={dateStringFormat(new Date(pickup.date))} />}
                    {pickup.includeTime && <SmallHeader text={timeStringFormat(new Date(pickup.date))} />}
                </div>
                {pickup.address}
            </div>

            <div>
                <div className='d-flex gap-2'>
                    <SmallHeader text='Delivery' />
                    {delivery.date && <SmallHeader text={dateStringFormat(new Date(delivery.date))} />}
                    {delivery.includeTime && <SmallHeader text={timeStringFormat(new Date(delivery.date))} />}
                </div>
                {delivery.address}
            </div>

            {parcel &&
                <div>
                    <SmallHeader text='Parcel' />
                    {parcel}
                </div>}

            {notes && <NotesList notes={notes} />}
        </div>
    );
};

export default JobOverview;