// components
import FilterCustomers from './FilterCustomers';
import FilterDrivers from './FilterDrivers';
import FilterStatuses from './FilterStatuses';

// functions
import { dateStringFormat_YYYY_MM_DD } from '../utils/StringUtils';

const FilterAndASort = ({ filters, setFilters, userIsAdmin = false }) => {
    return (
        <>
            {/* button to collapse and expand the filter options */}
            <div className='w-100'>
                <button
                    className='btn text-action border-0 py-0 ps-5 pe-0 ms-auto d-flex'
                    style={{ backgroundColor: 'transparent' }}
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseFilters'
                    aria-expanded='false'
                    aria-controls='collapseFilters'
                >
                    {`Filters (${Object.keys(filters).length})`}
                </button>
            </div>
            {/* element is collapsable */}
            <div
                className='collapse'
                id='collapseFilters'
            >
                <div className='d-flex flex-column gap-1' >
                    <FilterStatuses filter={filters.status || []} setFilters={setFilters} />
                    {userIsAdmin && <>
                        <FilterCustomers filter={filters.customer || []} setFilters={setFilters} />
                        <FilterDrivers filter={filters.drivers || []} setFilters={setFilters} />

                        {/* filter reference */}
                        <div className='d-flex flex-wrap align-items-center'>
                            <label htmlFor='referenceFilter' style={{ flex: '0 0 95px' }}><small>Reference:</small></label>
                            <input
                                className='form-control form-control-sm'
                                id='referenceFilter'
                                onChange={e => {
                                    const input = e.target.value;
                                    setFilters(prev => {
                                        const existingFilters = { ...prev };
                                        delete existingFilters.reference;

                                        if (!input) return existingFilters;

                                        existingFilters.reference = input;

                                        return existingFilters;
                                    })
                                }}
                                style={{ flex: '1 1 250px' }}
                                type='text'
                            />
                        </div>

                        {/* filter mileage range */}
                        <div className='d-flex flex-wrap align-items-center'>
                            <label htmlFor='mileageRange' style={{ flex: '0 0 95px' }}><small>Mileage:</small></label>
                            <div className='d-flex align-items-center' style={{ flex: '1 1 250px' }}>
                                <input
                                    className='form-control form-control-sm'
                                    id='mileageGTE'
                                    onChange={e => {
                                        const input = e.target.valueAsNumber;
                                        setFilters(prev => {
                                            const existingFilters = { ...prev };
                                            delete existingFilters.mileageGTE;

                                            if (isNaN(input)) return existingFilters;

                                            existingFilters.mileageGTE = input;

                                            return existingFilters;
                                        })
                                    }}
                                    type='number'
                                    value={filters.mileageGTE ?? ''}
                                />
                                <small className='px-2'>to</small>
                                <input
                                    className='form-control form-control-sm'
                                    id='mileageLTE'
                                    onChange={e => {
                                        const input = e.target.valueAsNumber;
                                        setFilters(prev => {
                                            const existingFilters = { ...prev };
                                            delete existingFilters.mileageLTE;

                                            if (isNaN(input)) return existingFilters;

                                            existingFilters.mileageLTE = input;

                                            return existingFilters;
                                        })
                                    }}
                                    type='number'
                                    value={filters.mileageLTE ?? ''}
                                />
                            </div>
                        </div>
                    </>}

                    {/* FILTER: PICKUP DATE GREATER THAN OR EQUAL TO LESS THAN OR EQUAL */}
                    <div className='d-flex flex-wrap align-items-center'>
                        <label className='text-nowrap' htmlFor='pickupOnRange' style={{ flex: '0 0 95px' }}><small>Pickup On:</small></label>
                        <div className='d-flex flex-column flex-sm-row align-items-center' style={{ flex: '1 1 250px' }}>
                            <input
                                className='form-control form-control-sm'
                                id='pickupOnGTE'
                                onChange={e => {
                                    const date = e.target.valueAsDate;

                                    setFilters(prev => {
                                        const existingFilters = { ...prev };
                                        delete existingFilters.pickupOnGTE;

                                        if (!date) return existingFilters;

                                        // this helps avoid falling back one day from user input
                                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                                        existingFilters.pickupOnGTE = date;

                                        return existingFilters;
                                    })
                                }}
                                type='date'
                                value={filters.pickupOnGTE ? dateStringFormat_YYYY_MM_DD(filters.pickupOnGTE) : ''}
                            />
                            <small className='px-2'>to</small>
                            <input
                                className='form-control form-control-sm'
                                id='pickupOnLTE'
                                onChange={e => {
                                    const date = e.target.valueAsDate;

                                    setFilters(prev => {
                                        const existingFilters = { ...prev };
                                        delete existingFilters.pickupOnLTE;

                                        if (!date) return existingFilters;

                                        // this helps avoid falling back one day from user input
                                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

                                        // this is the end of the range, so I want to set the time to the absolute last second of the chosen date
                                        date.setMilliseconds(999);
                                        date.setSeconds(59);
                                        date.setMinutes(59);
                                        date.setHours(23);
                                        existingFilters.pickupOnLTE = date;

                                        return existingFilters;
                                    })
                                }}
                                type='date'
                                value={filters.pickupOnLTE ? dateStringFormat_YYYY_MM_DD(filters.pickupOnLTE) : ''}
                            />
                        </div>
                    </div>

                    {/* FILTER: DELIVERY DATE GREATER THAN OR EQUAL TO LESS THAN OR EQUAL */}
                    <div className='d-flex flex-wrap align-items-center'>
                        <label className='text-nowrap' htmlFor='deliveryOnRange' style={{ flex: '0 0 95px' }}><small>Delivery On:</small></label>
                        <div className='d-flex flex-column flex-sm-row align-items-center' style={{ flex: '1 1 250px' }}>
                            <input
                                className='form-control form-control-sm'
                                id='deliveryOnGTE'
                                onChange={e => {
                                    const date = e.target.valueAsDate;

                                    setFilters(prev => {
                                        const existingFilters = { ...prev };
                                        delete existingFilters.deliveryOnGTE;

                                        if (!date) return existingFilters;

                                        // this helps avoid falling back one day from user input
                                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                                        existingFilters.deliveryOnGTE = date;

                                        return existingFilters;
                                    })
                                }}
                                type='date'
                                value={filters.deliveryOnGTE ? dateStringFormat_YYYY_MM_DD(filters.deliveryOnGTE) : ''}
                            />
                            <small className='px-2'>to</small>
                            <input
                                className='form-control form-control-sm'
                                id='deliveryOnLTE'
                                onChange={e => {
                                    const date = e.target.valueAsDate;

                                    setFilters(prev => {
                                        const existingFilters = { ...prev };
                                        delete existingFilters.deliveryOnLTE;

                                        if (!date) return existingFilters;

                                        // this helps avoid falling back one day from user input
                                        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

                                        // this is the end of the range, so I want to set the time to the absolute last second of the chosen date
                                        date.setMilliseconds(999);
                                        date.setSeconds(59);
                                        date.setMinutes(59);
                                        date.setHours(23);
                                        existingFilters.deliveryOnLTE = date;

                                        return existingFilters;
                                    })
                                }}
                                type='date'
                                value={filters.deliveryOnLTE ? dateStringFormat_YYYY_MM_DD(filters.deliveryOnLTE) : ''}
                            />
                        </div>
                    </div>

                    {/* FILTER: CREATED AT DATE GREATER THAN OR EQUAL TO LESS THAN OR EQUAL */}
                    {userIsAdmin &&
                        <div className='d-flex flex-wrap align-items-center'>
                            <label className='text-nowrap' htmlFor='createdOnRange' style={{ flex: '0 0 95px' }}><small>Created On:</small></label>
                            <div className='d-flex flex-column flex-sm-row align-items-center' style={{ flex: '1 1 250px' }}>
                                <input
                                    className='form-control form-control-sm'
                                    id='createdOnGTE'
                                    onChange={e => {
                                        const date = e.target.valueAsDate;

                                        setFilters(prev => {
                                            const existingFilters = { ...prev };
                                            delete existingFilters.createdOnGTE;

                                            if (!date) return existingFilters;

                                            // this helps avoid falling back one day from user input
                                            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                                            existingFilters.createdOnGTE = date;

                                            return existingFilters;
                                        })
                                    }}
                                    type='date'
                                    value={filters.createdOnGTE ? dateStringFormat_YYYY_MM_DD(filters.createdOnGTE) : ''}
                                />
                                <small className='px-2'>to</small>
                                <input
                                    className='form-control form-control-sm'
                                    id='createdOnLTE'
                                    onChange={e => {
                                        const date = e.target.valueAsDate;

                                        setFilters(prev => {
                                            const existingFilters = { ...prev };
                                            delete existingFilters.createdOnLTE;

                                            if (!date) return existingFilters;

                                            // this helps avoid falling back one day from user input
                                            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

                                            // this is the end of the range, so I want to set the time to the absolute last second of the chosen date
                                            date.setMilliseconds(999);
                                            date.setSeconds(59);
                                            date.setMinutes(59);
                                            date.setHours(23);
                                            existingFilters.createdOnLTE = date;

                                            return existingFilters;
                                        })
                                    }}
                                    type='date'
                                    value={filters.createdOnLTE ? dateStringFormat_YYYY_MM_DD(filters.createdOnLTE) : ''}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default FilterAndASort;