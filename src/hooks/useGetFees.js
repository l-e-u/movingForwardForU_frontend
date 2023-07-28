import { useState } from 'react';

// context
import { useFeesContext } from './useFeesContext';
import { useAuthContext } from './useAuthContext';

export const useGetFees = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useFeesContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const getFees = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/fees`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting all fees
      const json = await response.json();

      if (!response.ok) {
         console.error(json);
         setError(json.error);
      };

      if (response.ok) {
         setError(null);
         dispatch({ type: 'SET_FEES', payload: json });
      };

      setIsLoading(false);
   };

   return { getFees, error, isLoading };
};