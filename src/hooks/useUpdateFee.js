import { useState } from "react"

// context
import { useAuthContext } from "./useAuthContext";
import { useFeesContext } from "./useFeesContext";

export const useUpdateFee = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { dispatch } = useFeesContext();
   const { user } = useAuthContext();

   const updateFee = async ({ _id, fee }) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/fees/` + _id, {
         method: 'PATCH',
         body: JSON.stringify(fee),
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
         dispatch({ type: 'UPDATE_FEE', payload: json });
         return true;
      };
   };
   return { updateFee, isLoading, error };
};