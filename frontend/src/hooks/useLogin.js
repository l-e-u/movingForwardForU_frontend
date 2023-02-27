import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);

        // don't want to show the error if user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // expecting user (w/o password) and token
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        };

        if (response.ok) {
            const { user, token } = json;
            user.token = token;
            // save the user to local storage
            localStorage.setItem('token', JSON.stringify({ token: token }));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: user });

            setIsLoading(false);
        };
    };

    return { login, isLoading, error };
};