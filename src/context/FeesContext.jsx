import { createContext, useReducer } from 'react';

export const FeesContext = createContext();

export const feesReducer = (state, action) => {
   switch (action.type) {
      case 'SET_FEES':
         return { fees: action.payload };

      case 'CREATE_FEE':
         return { fees: [action.payload, ...state.fees] };

      case 'DELETE_FEE':
         return { fees: state.fees.filter((f) => f._id !== action.payload._id) };

      case 'UPDATE_FEE':
         return { fees: state.fees.map((f) => f._id === action.payload._id ? action.payload : f) };

      default:
         return state;
   };
};

// Every component wrapped by provider will have access to the context
export const FeesContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(feesReducer, { fees: [] });

   return (
      <FeesContext.Provider value={{ ...state, dispatch }}>
         {children}
      </FeesContext.Provider>
   );
};