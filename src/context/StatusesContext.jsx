import { createContext, useReducer } from 'react';

export const StatusesContext = createContext();

export const statusesReducer = (state, action) => {
   switch (action.type) {
      case 'SET_STATUSES':
         return { statuses: action.payload };

      case 'CREATE_STATUS':
         return { statuses: [action.payload, ...state.statuses] };

      case 'DELETE_STATUS':
         return { statuses: state.statuses.filter((s) => s._id !== action.payload._id) };

      case 'UPDATE_STATUS':
         return { statuses: state.statuses.map((s) => s._id === action.payload._id ? action.payload : s) };

      default:
         return state;
   };
};

// Every component wrapped by provider will have access to the context
export const StatusesContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(statusesReducer, { statuses: [] });

   return (
      <StatusesContext.Provider value={{ ...state, dispatch }}>
         {children}
      </StatusesContext.Provider>
   );
};