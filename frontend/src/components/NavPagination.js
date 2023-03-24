const NavPagination = ({
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    setTotalPages,
    totalPages,
    totalResults,
}) => {
    const hasPrevious = currentPage === 1 ? false : true;
    const hasNext = currentPage === totalPages ? false : true;
    const pageNumbersJSX = [];

    for (let index = 0; index < totalPages; index++) {
        const pageNumber = index + 1;

        pageNumbersJSX.push(
            <li className='page-item' key={pageNumber}>
                <button
                    className='page-link text-action py-1 px-3'
                    disabled={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{ width: '50px' }}
                >
                    {pageNumber}
                </button>
            </li>
        );
    };

    return (
        <nav aria-label='Jobs list pagination' className='d-flex justify-content-center align-items-center mb-3'>
            <ul className='pagination d-flex flex-wrap pagination-sm m-0'>
                <li className={'page-item' + (hasPrevious ? '' : ' disabled')} key={0}>
                    <button
                        className='page-link text-action py-1 px-3'
                        disabled={!hasPrevious}
                        onClick={() => {
                            if (hasPrevious) setCurrentPage(prev => --prev);
                        }}
                        style={{ width: '50px' }}
                    >
                        &laquo;
                    </button>
                </li>
                {pageNumbersJSX}
                <li className={'page-item' + (hasNext ? '' : ' disabled')} key={totalPages + 1}>
                    <button
                        className='page-link text-action py-1 px-3'
                        disabled={!hasNext}
                        onClick={() => {
                            if (hasNext) setCurrentPage(prev => ++prev);
                        }}
                        style={{ width: '50px' }}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>

            <select
                className='form-select form-select-sm text-secondary text-end border-0 ms-2 flex-shrink-0'
                name='limitSelect'
                id='limitSelect'
                onChange={e => {
                    const input = e.target.value;
                    const value = input === 'All' ? 0 : Number(input);
                    setLimit(value);
                    setCurrentPage(1);
                    setTotalPages(1);
                }}
                value={limit > 0 ? String(limit) : 'All'}
                style={{ width: '70px', backgroundColor: 'transparent' }}>
                <option>5</option>
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
                <option>All</option>
            </select>

            <small className='text-secondary text-center my-1 flex-shrink-0'>
                {'of ' + totalResults}
            </small>
        </nav>
    );
};

export default NavPagination;