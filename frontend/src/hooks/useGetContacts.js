import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useContactsContext } from './useContactsContext';

export const useGetContacts = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useContactsContext();
    const { user } = useAuthContext();

    const getContacts = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/contacts', {
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting all contactses
        const json = await response.json();

        if (response.ok) {
            setError(null)
            setIsLoading(false);
            dispatch({ type: 'SET_CONTACTS', payload: json });
            return true;
        };

        if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
            return false;
        };
    };
    return { getContacts, error, isLoading };
};