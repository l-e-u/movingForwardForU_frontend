import { useState } from 'react';

// utilities
import { urlQueryString } from '../utils/StringUtils.js';

// context
import { useAuthContext } from './useAuthContext.js';
import { useJobsContext } from './useJobsContext.js';

export const useGetJobs = (subPath = '') => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useJobsContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const getJobs = async (props = { filters: {}, currentPage: 1, limit: 0, setPaginationTotals: () => { } }) => {
      setIsLoading(true);
      setError(null);

      // set the query and options before making the response
      const { filters, currentPage, limit, setPaginationTotals } = props;
      const filtersQuery = urlQueryString(filters);

      const response = await fetch(`${API_BASE_URL}/api/jobs${subPath}?page=${currentPage}&limit=${limit}${filtersQuery}`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting the list of jobs depending on page and limit
      const json = await response.json();

      if (!response.ok) setError(json.error);

      if (response.ok) {
         const { paginatedResults, totalNumberOfResults, totalNumberOfPages } = json;

         setError(null);
         dispatch({ type: 'SET_JOBS', payload: paginatedResults });
         setPaginationTotals({
            totalNumberOfResults,
            totalNumberOfPages
         });
      };

      setIsLoading(false);
   };

   return { getJobs, error, isLoading };
};