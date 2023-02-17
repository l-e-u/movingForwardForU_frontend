import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { useContactsContext } from "./useContactsContext";

export const useUpdateContact = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useContactsContext();
    const { user } = useAuthContext();

    const updateContact = async ({ _id, contact }) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/contacts/' + _id, {
            method: 'PATCH',
            body: JSON.stringify(contact),
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
        };

        if (response.ok) {
            setError(null);
            setIsLoading(false);
            dispatch({ type: 'UPDATE_CONTACT', payload: json });
        };
    };
    return { updateContact, isLoading, error };
};