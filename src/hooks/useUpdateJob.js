import { useState } from 'react'
import { useAuthContext } from './useAuthContext';

export const useUpdateJob = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);
   const { user } = useAuthContext();

   const updateJob = async ({ _id, updatedJobForm }) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/jobs/` + _id, {
         method: 'PATCH',
         body: updatedJobForm,
         headers: { 'Authentication': `Bearer ${user.token}` }
      });

      // expecting the updated job doc
      const json = await response.json();

      if (!response.ok) {
         console.error(json);

         setError(json.error);
         setIsLoading(false);
         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);

         return json;
      };
   };
   return { updateJob, isLoading, error, setError };
};