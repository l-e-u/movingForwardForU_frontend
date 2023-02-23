import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useJobsContext } from './useJobsContext';

export const useGetJobs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const getJobs = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/jobs', {
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting all jobses
        const json = await response.json();

        if (response.ok) {
            setError(null)
            setIsLoading(false);
            dispatch({ type: 'SET_JOBS', payload: json });
            return true;
        };

        if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
            return false;
        };
    };
    return { getJobs, error, isLoading };
};