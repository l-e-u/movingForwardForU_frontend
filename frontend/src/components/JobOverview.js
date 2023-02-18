import DriversList from "./DriversList";
import LogHistory from "./LogHistory";
import SmallHeader from "./SmallHeader";

const JobOverview = ({
    pickup,
    delivery,
    parcel,
    reference,
    status,
    drivers,
    customer,
    logs
}) => {
    const hasDriver = drivers.length > 0;

    return (
        <div>
            <div className="mb-1">{status.name}</div>
            <div className="d-flex flex-wrap justify-content-between mb-2">
                <h2 className='text-primary fs-5 m-0'>{customer.organization}</h2>
                {reference && <small className="text-green text-end align-self-end flex-grow-1">{reference}</small>}
            </div>

            {!hasDriver && <div className="text-danger mb-2">No driver has been assigned.</div>}

            {hasDriver &&
                <div className="mb-2">
                    <SmallHeader text={'Driver' + ((drivers.length > 1) ? 's' : '')} />
                    <DriversList list={drivers} />
                </div>}


            <div className="mb-2">
                <SmallHeader text='Pickup' />
                {pickup.address}
            </div>

            <div className="mb-2">
                <SmallHeader text='Delivery' />
                {delivery.address}
            </div>

            {parcel &&
                <div className="mt-2">
                    <SmallHeader text='Parcel' />
                    {parcel}
                </div>}

            <LogHistory logs={logs} />
        </div>
    );
};

export default JobOverview;