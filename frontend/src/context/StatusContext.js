import { createContext, useReducer } from 'react';

export const StatusContext = createContext();

export const statusReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STATUS':
            return { status: action.payload };

        case 'CREATE_STATUS':
            return { status: [action.playload, ...state.status] };

        default: state;
    };
};

// Every component wrapped by provider will have access to the context
export const StatusContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(statusReducer, {
        status: null
    });


    return (
        <StatusContext.Provider value={{ state, dispatch }}>
            {children}
        </StatusContext.Provider>
    );
};