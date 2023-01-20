import { createContext, useReducer } from 'react';

export const JobsContext = createContext();

export const jobsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_JOBS':
            return { jobs: action.payload };

        case 'CREATE_JOBS':
            return { jobs: [action.playload, ...state.jobs] };

        default: state;
    };
};

// Every component wrapped by provider will have access to the context
export const JobsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        jobsReducer,
        { jobs: null }
    );

    return (
        <JobsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </JobsContext.Provider>
    );
};