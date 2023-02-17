import DriversList from "./DriversList";
import LogHistory from "./LogHistory";
import SmallHeader from "./SmallHeader";

const JobOverview = ({
    pickup,
    delivery,
    parcel,
    vehicle,
    reference,
    status,
    drivers,
    customer,
    logs
}) => {
    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between mb-2">
                <h2 className='text-primary fs-5 m-0'>{customer.organization}</h2>
                {reference && <small className="text-green text-end align-self-end flex-grow-1">{reference}</small>}
            </div>

            <DriversList list={drivers} />

            <SmallHeader text='Pickup' />
            <div className="mb-2">{pickup.address}</div>

            <SmallHeader text='Delivery' />
            <div>{delivery.address}</div>

            {parcel &&
                <div className="mt-2">
                    <SmallHeader text='Parcel' />
                    <div>{parcel}</div>
                </div>}
            <LogHistory logs={logs} />
        </div>
    );
};

export default JobOverview;