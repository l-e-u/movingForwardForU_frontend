import { useState } from 'react';

import { useAuthContext } from './useAuthContext';
import { useUsersContext } from './useUsersContext';

export const useRegisterUser = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { dispatch } = useUsersContext();
   const { user } = useAuthContext();

   const registerUser = async (newUser) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users`, {
         method: 'POST',
         body: JSON.stringify(newUser),
         headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting the newly registerd user
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);

         dispatch({ type: 'CREATE_USER', payload: json });

         return true;
      };
   };

   return { registerUser, isLoading, error };
};