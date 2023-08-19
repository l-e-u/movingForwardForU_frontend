import { useState } from 'react';
import { useParams } from 'react-router';

export const useVerifyEmail = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { emailToken } = useParams();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const verifyEmail = async (callBack) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users/verify`, {
         method: 'POST',
         body: JSON.stringify({ emailToken }),
         headers: { 'Content-Type': 'application/json' }
      });

      const json = await response.json();

      if (!response.ok) setError(json.error);

      if (response.ok) {
         setError(null);
         callBack(json);
      };

      setIsLoading(false);
   };

   return { verifyEmail, error, isLoading };
};