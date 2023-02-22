import { useEffect } from 'react';
import { useStatusesContext } from '../hooks/useStatusesContext';

const StatusSelect = ({ hasSelected, setJob, error, token, value }) => {
    const { statuses, dispatch } = useStatusesContext();

    const errorFromStatusSelection = error?.status;

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('/api/statuses', {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STATUSES', payload: json });
            };

            if (!response.ok) {
                console.error(json);
            };
        };

        fetchStatuses();
    }, [dispatch]);

    return (
        <div className='form-floating mb-2'>
            <select
                className={'form-select' + (errorFromStatusSelection ? ' is-invalid' : '')}
                type='text'
                name='status'
                id='status'
                aria-label='Status'
                value={value}
                onChange={(e) => {
                    const value = e.target.value;

                    setJob(prev => {
                        return {
                            ...prev,
                            status: statuses.find(s => s.name === value)
                        }
                    })
                }}>
                {!hasSelected && <option>Select...</option>}
                {statuses && statuses.map(s => {
                    const { _id, name } = s;
                    return (
                        <option key={_id} value={name}>{name}</option>
                    )
                })}
            </select>
            <label htmlFor='status' className='form-label required'>
                Status
                {errorFromStatusSelection && <span className='inputError'>{error.status.message}</span>}
            </label>
        </div>
    );
};

export default StatusSelect;