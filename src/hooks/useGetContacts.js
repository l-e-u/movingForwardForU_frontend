import { useState } from 'react';

// context
import { useContactsContext } from './useContactsContext';
import { useAuthContext } from './useAuthContext';

export const useGetContacts = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const { user } = useAuthContext();
   const { dispatch } = useContactsContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   // when nothing is passed, then all the results will be returned and no callback is used
   const getContacts = async (props = { currentPage: 1, limit: 0, setPaginationTotals: () => { } }) => {
      const { currentPage, limit, setPaginationTotals } = props;

      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/contacts?page=${currentPage}&limit=${limit}`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting all contacts
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
      };

      if (response.ok) {
         const { paginatedResults, totalNumberOfResults, totalNumberOfPages } = json;

         setError(null);
         dispatch({ type: 'SET_CONTACTS', payload: paginatedResults });

         setPaginationTotals({
            totalNumberOfResults,
            totalNumberOfPages
         });
      };

      setIsLoading(false);
   };

   return { getContacts, error, isLoading };
};