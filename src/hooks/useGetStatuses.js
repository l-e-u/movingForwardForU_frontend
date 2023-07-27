import { useState } from 'react';

// context
import { useStatusesContext } from './useStatusesContext';
import { useAuthContext } from './useAuthContext';

export const useGetStatuses = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useStatusesContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const getStatuses = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/statuses`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting all statuses
      const json = await response.json();

      if (!response.ok) {
         console.error(json);
         setError(json.error);
      };

      if (response.ok) {
         setError(null);
         dispatch({ type: 'SET_STATUSES', payload: json });
      };

      setIsLoading(false);
   };

   return { getStatuses, error, isLoading };
};