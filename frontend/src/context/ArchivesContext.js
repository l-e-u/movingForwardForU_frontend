import { createContext, useReducer } from 'react';

export const ArchivesContext = createContext();

export const archivesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ARCHIVES':
            return { archives: action.payload };

        // takes the new archive and merges it with the rest of the archives array
        case 'CREATE_ARCHIVE':
            return { archives: [action.payload, ...state.archives] };

        case 'DELETE_ARCHIVE':
            return { archives: state.archives.filter((j) => j._id !== action.payload._id) };

        case 'UPDATE_ARCHIVE':
            return { archives: state.archives.map((j) => j._id === action.payload._id ? action.payload : j) };

        default:
            return state;
    };
};

// Every component wrapped by provider will have access to the context
export const ArchivesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        archivesReducer,
        { archives: null }
    );

    return (
        <ArchivesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ArchivesContext.Provider>
    );
};