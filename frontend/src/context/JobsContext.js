import { createContext, useReducer } from 'react';

export const JobsContext = createContext();

export const jobsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_JOBS':
            return { jobs: action.payload };

        // takes the new job and merges it with the rest of the jobs array
        case 'CREATE_JOB':
            return { jobs: [action.payload, ...state.jobs] };

        case 'DELETE_JOB':
            return { jobs: state.jobs.filter((j) => j._id !== action.payload._id) };

        case 'UPDATE_JOB':
            return { jobs: state.jobs.map((j) => j._id === action.payload._id ? action.payload : j) };

        default:
            return state;
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