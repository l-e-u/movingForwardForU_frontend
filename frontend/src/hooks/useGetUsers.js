import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useUsersContext } from './useUsersContext';

export const useGetUsers = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useUsersContext();
    const { user } = useAuthContext();

    const getUsers = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/users', {
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        // expecting all users
        const json = await response.json();

        if (response.ok) {
            setError(null)
            setIsLoading(false);
            dispatch({ type: 'SET_USERS', payload: json });
            return true;
        };

        if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
            return false;
        };
    };
    return { getUsers, error, isLoading };
};