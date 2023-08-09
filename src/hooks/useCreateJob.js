import { useState } from "react";

// context
import { useAuthContext } from "./useAuthContext";

export const useCreateJob = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);
   const { user } = useAuthContext();

   const createJob = async (jobForm) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
         method: 'POST',
         body: jobForm,
         headers: { 'Authentication': `Bearer ${user.token}` }
      });

      // expecting the newly created status
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

   return { createJob, isLoading, error, setError };
};