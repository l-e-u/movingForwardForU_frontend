import { useState } from 'react';

// context
import { useUsersContext } from './useUsersContext';
import { useAuthContext } from './useAuthContext';

export const useGetUsers = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useUsersContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const getUsers = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting all users
      const json = await response.json();

      if (!response.ok) {
         console.error(json);
         setError(json.error);
      };

      if (response.ok) {
         setError(null);
         dispatch({ type: 'SET_USERS', payload: json });
      };

      setIsLoading(false);
   };

   return { getUsers, error, isLoading };
};