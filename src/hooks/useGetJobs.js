import { useState } from 'react';

// utilities
import { urlQueryString } from '../utils/StringUtils.js';

// context
import { useAuthContext } from './useAuthContext.js';
import { useJobsContext } from './useJobsContext.js';

export const useGetJobs = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useJobsContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const clearError = () => setError(null);

   const getJobs = async ({ filters, currentPage, limit }) => {
      setIsLoading(true);
      setError(null);

      const filtersQuery = urlQueryString(filters);

      const response = await fetch(`${API_BASE_URL}/api/jobs?page=${currentPage}&limit=${limit}${filtersQuery}`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting the list of jobs depending on page and limit
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);
      };

      if (response.ok) {
         const { count, totalPages, results } = json;

         setError(null);
         setIsLoading(false);


         dispatch({ type: 'SET_JOBS', payload: results });
         return { count, totalPages };

      };
   };

   return { clearError, getJobs, error, isLoading };
};