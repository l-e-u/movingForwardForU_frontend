import { createContext, useReducer } from "react";

export const ActionsContext = createContext();

export const actionsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACTIONS':
            return { actions: action.payload };

        case 'CREATE_ACTION':
            return { actions: [action.payload, ...state.actions] };

        case 'DELETE_ACTION':
            return {
                actions: state.actions.filter((a) => a._id !== action.payload._id)
            };

        default:
            return state;
    };
};

// Every component wrapped by provider will have access to the context
export const ActionsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        actionsReducer,
        { actions: null }
    );

    return (
        <ActionsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ActionsContext.Provider>
    )
};