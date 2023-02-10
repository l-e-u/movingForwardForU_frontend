import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { useStatusesContext } from "./useStatusesContext";

export const useCreateStatus = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    const createStatus = async (status) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('http://localhost:4000/api/statuses', {
            method: 'POST',
            body: JSON.stringify(status),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting the newly created status
        const json = await response.json();

        if (!response.ok) {
            setError(json.error.errors);
            setIsLoading(false);
        };

        if (response.ok) {
            dispatch({ type: 'CREATE_STATUS', payload: json });
            setError(null);
            setIsLoading(false);
        };
    };

    return { createStatus, isLoading, error }
}