// functions
import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

// components
import DriversList from './DriversList';
import LogHistory from './LogHistory';
import SmallHeader from './SmallHeader';

const JobOverview = ({
    pickup,
    delivery,
    parcel,
    reference,
    status,
    drivers,
    customer,
    logs,
    listDrivers = false
}) => {
    const hasDrivers = drivers.length > 0;
    const showDrivers = hasDrivers && listDrivers;

    return (
        <div>
            <div className='mb-1'>{status.name.toUpperCase()}</div>
            <div className='d-flex flex-wrap justify-content-between gap-2 mb-2'>
                <h2 className='text-primary fs-5 m-0'>{customer.organization}</h2>
                {reference && <small className='text-green text-end align-self-end flex-grow-1'>{reference}</small>}
            </div>

            {!hasDrivers && <div className='text-danger mb-2'>No driver has been assigned.</div>}

            {showDrivers &&
                <div className='mb-2'>
                    <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                    <DriversList list={drivers} />
                </div>}


            <div className='mb-2'>
                <div className='d-flex gap-2'>
                    <SmallHeader text='Pickup' />
                    {pickup.date && <SmallHeader text={dateStringFormat(new Date(pickup.date))} />}
                    {pickup.includeTime && <SmallHeader text={timeStringFormat(new Date(pickup.date))} />}
                </div>
                {pickup.address}
            </div>

            <div className='mb-2'>
                <div className='d-flex gap-2'>
                    <SmallHeader text='Delivery' />
                    {delivery.date && <SmallHeader text={dateStringFormat(new Date(delivery.date))} />}
                    {delivery.includeTime && <SmallHeader text={timeStringFormat(new Date(delivery.date))} />}
                </div>
                {delivery.address}
            </div>

            {parcel &&
                <div className='mt-2'>
                    <SmallHeader text='Parcel' />
                    {parcel}
                </div>}

            <LogHistory logs={logs} />
        </div>
    );
};

export default JobOverview;