import { useState } from "react";

// context
import { useAuthContext } from "./useAuthContext";
import { useStatusesContext } from "./useStatusesContext";

export const useUpdateStatus = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { dispatch } = useStatusesContext();
   const { user } = useAuthContext();

   const updateStatus = async ({ _id, status }) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/statuses/` + _id, {
         method: 'PATCH',
         body: JSON.stringify(status),
         headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${user.token}`
         }
      });

      // expecting status with updated fields
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);
         dispatch({ type: 'UPDATE_STATUS', payload: json });

         return true;
      };
   };
   return { updateStatus, isLoading, error };
};