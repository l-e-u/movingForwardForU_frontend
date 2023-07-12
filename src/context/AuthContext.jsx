import { createContext, useReducer, useEffect } from 'react';
import { Navigate } from 'react-router';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
   switch (action.type) {
      case 'LOGIN':
         return { user: action.payload };

      case 'LOGOUT':
         return { user: null };

      default:
         return state;
   };
};

export const AuthContextProvider = ({ children }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [state, dispatch] = useReducer(authReducer, {
      user: null
   });

   // at first load, check if there's a user's token in local storage that has not been expired
   useEffect(() => {
      const item = localStorage.getItem('token');

      if (!item) return;

      const { token } = JSON.parse(item);

      const autoLogin = async () => {
         const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authentication': `Bearer ${token}`
            }
         });

         // user doc if valid
         const user = await response.json();
         user.token = token;

         if (response.ok) {
            dispatch({ type: 'LOGIN', payload: user });
         };

         // If JWT malformed or expired. navigate user to the login screen
         if (!response.ok) {
            // remove user form storage
            localStorage.removeItem('token');
            <Navigate to='/login' />
         };
      };

      if (token) autoLogin();
   }, [API_BASE_URL]);

   return (
      <AuthContext.Provider value={{ ...state, dispatch }}>
         {children}
      </AuthContext.Provider>
   );
};