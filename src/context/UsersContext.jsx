import { createContext, useReducer } from 'react';

export const UsersContext = createContext();

export const usersReducer = (state, action) => {
   switch (action.type) {
      case 'SET_USERS':
         return { users: action.payload };

      case 'CREATE_USER':
         return { users: [action.payload, ...state.users] };

      case 'DELETE_USER':
         return { users: state.users.filert((u) => u._id !== action.payload._id) };

      case 'UPDATE_USER':
         return { users: state.users.map((u) => u._id === action.payload._id ? action.payload : u) };

      default:
         return state;
   };
};

// Every component wrapped by provider will have access to the context
export const UsersContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(usersReducer, { users: [] });

   return (
      <UsersContext.Provider value={{ ...state, dispatch }}>
         {children}
      </UsersContext.Provider>
   );
};