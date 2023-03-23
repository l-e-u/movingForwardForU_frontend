import { useEffect, useState } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useJobsContext } from '../hooks/useJobsContext'

const NavPagination = () => {
    const { jobs, dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState({ current: 1, next: null, previous: null });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/jobs?page=${pages.current}&limit=${limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting the list of jobs depending on page and limit
            const json = await response.json();

            if (!response.ok) {
                console.error(json);
                setError(json.error);
                setIsLoading(false);
            };

            if (response.ok) {
                setError(null);
                setIsLoading(false);
                console.log('jobs list:', json)
                // dispatch({ type: 'SET_JOBS', payload: json });
            };
        })();
    }, [dispatch, limit, pages, user]);

    const hasPrevious = pages.previous === null ? false : true;
    const hasNext = pages.next === null ? false : true;

    return (
        <nav aria-label='Jobs list pagination'>
            <div className='d-flex justify-content-center gap-3'>
                <ul className='pagination pagination-sm m-0'>
                    <li className={'page-item' + (hasPrevious ? '' : ' disabled')} key={0}>
                        <button
                            className='page-link'
                            disabled={!hasPrevious}
                        >
                            &laquo;
                        </button>
                    </li>
                    <li className={'page-item' + (hasNext ? '' : ' disabled')} key={(jobs ? jobs.length + 1 : 1)}>
                        <button
                            className='page-link'
                            disabled={!hasNext}
                        >
                            &raquo;
                        </button>
                    </li>
                </ul>

                <select
                    className='form-select form-select-sm text-reset'

                    style={{ width: '75px' }}>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                    <option>All</option>
                </select>
            </div>

            <p className='smallPrint text-secondary text-center my-1'>
                {'Count: ' + (jobs ? jobs.length : 0)}
            </p>
        </nav>
    )
}

export default NavPagination;