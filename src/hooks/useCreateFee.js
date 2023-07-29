import { useState } from 'react';

// context
import { useAuthContext } from './useAuthContext';
import { useFeesContext } from './useFeesContext';

export const useCreateFee = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { dispatch } = useFeesContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const createFee = async (fee) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/fees`, {
         method: 'POST',
         body: JSON.stringify(fee),
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

         dispatch({ type: 'CREATE_FEE', payload: json });
         return true;
      };
   };

   const clearError = () => setError(null);

   return { createFee, clearError, isLoading, error };
};