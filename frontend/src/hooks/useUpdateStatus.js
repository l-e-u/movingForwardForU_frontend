import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { useStatusesContext } from "./useStatusesContext";

export const useUpdateStatus = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    const updateStatus = async ({ name, description, _id }) => {

        console.log('name:', name);
        console.log('desc:', description)

        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('http://localhost:4000/api/statuses/' + _id, {
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
            console.error(error);
            setError(json.error);
            setIsLoading(false);
        };

        if (response.ok) {
            setError(null);
            setIsLoading(false);
            dispatch({ type: 'UPDATE_STATUS', payload: json });
        };
    };
    return { updateStatus, isLoading, error };
};