import { useState } from 'react'

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

export const useDeleteDocument = ({
   apiRouteName,
   deleteFromContext,
   documentID,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { user } = useAuthContext();

   const deleteDocument = async () => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/${apiRouteName}/${documentID}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting the deleted document
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);

         deleteFromContext(json);

         return true;
      };
   };

   return { deleteDocument, isLoading, error };
};