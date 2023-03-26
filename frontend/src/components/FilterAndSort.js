// components
import FilterStatuses from './FilterStatuses';

const FilterAndASort = ({ filters, setFilters }) => {
    return (
        <>
            {/* button to collapse and expand the filter options */}
            <div>
                <button
                    className='btn text-action border-0 py-0 ps-5 pe-0 ms-auto d-flex'
                    style={{ backgroundColor: 'transparent' }}
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseFilters'
                    aria-expanded='false'
                    aria-controls='collapseFilters'
                >
                    Filters
                </button>
            </div>
            {/* element is collapsable */}
            <div
                className='collapse'
                id='collapseFilters'
            >
                <FilterStatuses
                    filters={filters}
                    filter={filters.status || []}
                    setFilters={setFilters}
                    setStatusFilter={(selectedStatuses) => {
                        setFilters(prev => {
                            const existingFilters = { ...prev };
                            delete existingFilters.status;

                            if (selectedStatuses.length > 0) existingFilters.status = selectedStatuses;

                            return existingFilters;
                        })
                    }}
                />
            </div>
        </>
    );
};

export default FilterAndASort;