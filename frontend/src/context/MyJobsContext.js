import { createContext, useReducer } from 'react';

export const MyJobsContext = createContext();

export const myJobsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MYJOBS':
            return { myJobs: action.payload };

        // takes the new job and merges it with the rest of the myJobs array
        case 'CREATE_MYJOB':
            return { myJobs: [action.payload, ...state.myJobs] };

        case 'DELETE_MYJOB':
            return {
                myJobs: state.myJobs.filter((mj) => mj._id !== action.payload._id)
            };

        default:
            return state;
    };
};

// Every component wrapped by provider will have access to the context
export const MyJobsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        myJobsReducer,
        { myJobs: null }
    );

    return (
        <MyJobsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MyJobsContext.Provider>
    );
};