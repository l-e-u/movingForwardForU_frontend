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

   const getContacts = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
         headers: {
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting all contacts
      const json = await response.json();

      if (!response.ok) {
         console.error(json);
         setError(json.error);
      };

      if (response.ok) {
         setError(null);
         dispatch({ type: 'SET_CONTACTS', payload: json });
      };

      setIsLoading(false);
   };

   return { getContacts, error, isLoading };
};