import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useContactsContext } from "./useContactsContext";

export const useCreateContact = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useContactsContext();
    const { user } = useAuthContext();

    const createContact = async (contact) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/contacts', {
            method: 'POST',
            body: JSON.stringify(contact),
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
        };

        if (response.ok) {
            setError(null);
            setIsLoading(false);

            dispatch({ type: 'CREATE_CONTACT', payload: json });
        };
    };

    return { createContact, isLoading, error };
};