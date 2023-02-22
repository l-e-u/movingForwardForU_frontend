import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useJobsContext } from './useJobsContext';

export const useUpdateJob = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const updateJob = async ({ _id, job }) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/jobs' + _id, {
            method: 'PATCH',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting the updated job doc
        const json = await response.json();

        if (!response.ok) {
            console.error(json);

            setError(json.error);
            setIsLoading(false);
            return false;
        };

        if (response.ok) {
            setError(null);
            setIsLoading(false);
            dispatch({ type: 'UPDATE_JOB', payload: json });
            return true;
        };
    };
    return { updateJob, isLoading, error };
};