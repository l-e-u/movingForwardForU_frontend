import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useStatusesContext } from './useStatusesContext';

export const useGetStatuses = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    const getStatuses = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/statuses', {
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting all statuses
        const json = await response.json();

        if (response.ok) {
            setError(null)
            setIsLoading(false);
            dispatch({ type: 'SET_STATUSES', payload: json });
            return true;
        };

        if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
            return false;
        };
    };
    return { getStatuses, error, isLoading };
};