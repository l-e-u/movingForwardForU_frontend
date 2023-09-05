import { useState } from 'react'

// context
import { useAuthContext } from './useAuthContext';

export const useArchiveJob = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { user } = useAuthContext();

   const archiveJob = async ({ _id }) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/jobs/archive/` + _id, {
         method: 'PATCH',
         headers: { 'Authentication': `Bearer ${user.token}` }
      });

      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);

         return true;
      };
   };
   return { archiveJob, isLoading, error };
};