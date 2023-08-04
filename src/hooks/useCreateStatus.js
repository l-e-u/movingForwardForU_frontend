import { useState } from 'react'

// context
import { useAuthContext } from './useAuthContext';
import { useStatusesContext } from './useStatusesContext';

export const useCreateStatus = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useStatusesContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const clearError = () => setError(null);

   const createStatus = async (status) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/statuses`, {
         method: 'POST',
         body: JSON.stringify(status),
         headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting the newly created status
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);
         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);

         dispatch({ type: 'CREATE_STATUS', payload: json });
         return true;
      };
   };

   return { clearError, createStatus, isLoading, error };
};