import { createContext, useReducer } from 'react';

export const StatusesContext = createContext();

export const statusesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STATUSES':
            return { statuses: action.payload };

        case 'CREATE_STATUS':
            return { statuses: [action.playload, ...state.statuses] };

        default:
            return state;
    };
};

// Every component wrapped by provider will have access to the context
export const StatusesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(statusesReducer, { statuses: null });

    return (
        <StatusesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </StatusesContext.Provider>
    );
};