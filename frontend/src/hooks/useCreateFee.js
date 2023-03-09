import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useFeesContext } from "./useFeesContext";

export const useCreateFee = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useFeesContext();
    const { user } = useAuthContext();

    const createFee = async (fee) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/fees', {
            method: 'POST',
            body: JSON.stringify(fee),
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

            dispatch({ type: 'CREATE_FEE', payload: json });
            return true;
        };
    };

    return { createFee, isLoading, error };
};