import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (username, email, password) => {
        setIsLoading(true);

        // don't want to show the error if user is trying to rectify, so null error at the start
        setError(null);

        const response = await fetch('http://localhost:4000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        // expecting username, isAdmin boolean, and jwt token
        const json = await response.json();

        if (!response.ok) {
            console.log('in signUp:', json.error.errors);
            setIsLoading(false);
            setError(json.error);
        };

        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('token', JSON.stringify({ token: json.token }));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        };
    };

    return { signup, isLoading, error };
};