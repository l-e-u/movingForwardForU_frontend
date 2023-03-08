import { useState } from 'react'

export const useVerify = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const verify = async ({ token, password, confirmPassword }) => {
        setIsLoading(true);

        // don't want to show the error if user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/users/verify/' + token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, confirmPassword })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            return false;
        };

        if (response.ok) {
            setIsLoading(false);
            return true;
        };
    };

    return { verify, isLoading, error };
};