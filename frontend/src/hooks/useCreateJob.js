import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useJobsContext } from "./useJobsContext";

export const useCreateJob = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const createJob = async (job) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting the newly created status
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

            dispatch({ type: 'CREATE_JOB', payload: json });
            return true;
        };
    };

    return { createJob, isLoading, error };
};