import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { useStatusesContext } from "./useStatusesContext";

export const useUpdateStatus = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    const updateStatus = async ({ name, description, _id }) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/statuses/' + _id, {
            method: 'PATCH',
            body: JSON.stringify({ name, description }),
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting status with updated fields
        const json = await response.json();

        if (!response.ok) {
            console.log(json);

            setError(json.error);
            setIsLoading(false);
            return false;
        };

        if (response.ok) {
            setError(null);
            setIsLoading(false);
            dispatch({ type: 'UPDATE_STATUS', payload: json });
            return true;
        };
    };
    return { updateStatus, isLoading, error };
};