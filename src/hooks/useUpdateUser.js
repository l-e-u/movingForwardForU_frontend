import { useState } from 'react';

// context
import { useAuthContext } from './useAuthContext';
import { useUsersContext } from './useUsersContext';

export const useUpdateUser = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { dispatch } = useUsersContext();
   const { user } = useAuthContext();

   const updateUser = async ({ _id, updatedFields }) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users/` + _id, {
         method: 'PATCH',
         body: JSON.stringify(updatedFields),
         headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${user.token}`
         }
      });

      //  expecting updated user profile
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         console.log(json)
         setError(null);
         setIsLoading(false);
         dispatch({ type: 'UPDATE_USER', payload: json });

         return true;
      };
   };

   return { updateUser, isLoading, error };
};