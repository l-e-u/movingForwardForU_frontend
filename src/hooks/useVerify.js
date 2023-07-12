import { useState } from 'react'

export const useVerify = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const verify = async ({ _id, password, confirmPassword }) => {
      setIsLoading(true);

      // don't want to show the error if user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users/verify`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ _id, password, confirmPassword })
      });

      const json = await response.json();

      if (!response.ok) {
         setIsLoading(false);
         setError(json.error);
         return false;
      };

      if (response.ok) {
         setIsLoading(false);
         return true;
      };
   };

   return { verify, isLoading, error };
};