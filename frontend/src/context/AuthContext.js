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
        const item = localStorage.getItem('token');

        if (!item) return;

        const { token } = JSON.parse(item);

        const fetchPermission = async () => {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${token}`
                }
            });

            // user doc if valid
            const user = await response.json();
            user.token = token;

            if (response.ok) {
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