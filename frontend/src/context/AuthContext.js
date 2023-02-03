import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };

        case 'LOGOUT':
            return { user: null };

        default:
            return state;
    };
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    // at first load, check if there's a user's token in local storage that has not been expired
    useEffect(() => {
        const { token } = JSON.parse(localStorage.getItem('token'));

        const fetchPermission = async () => {
            const response = await fetch('http://localhost:4000/api/users/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${token}`
                }
            });

            // user doc if valid
            const json = await response.json();

            if (response.ok) {
                const { username, isAdmin } = json;
                const user = {
                    username,
                    isAdmin,
                    token
                };
                dispatch({ type: 'LOGIN', payload: user });
            };
        };

        if (token) fetchPermission();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};