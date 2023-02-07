import { createContext, useReducer } from "react";

export const StopsContext = createContext();

export const stopsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STOPS':
            return { stops: action.payload };

        case 'CREATE_STOP':
            return { stops: [action.payload, ...state.stops] };

        case 'DELETE_STOP':
            return {
                stops: state.stops.filter((s) => s._id !== action.payload._id)
            };

        default:
            return state;
    };
};

// Every component wrapped by provider will have access to the context
export const StopsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        stopsReducer,
        { stops: null }
    );

    return (
        <StopsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </StopsContext.Provider>
    )
};