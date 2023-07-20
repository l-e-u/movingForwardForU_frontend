import { useState } from 'react';

export const useResetPassword = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);

   const resetPassword = async (email) => {
      setIsLoading(true);

      setResetPasswordEmailSent(false);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users/resetPassword`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email }),
      });

      // expecting confirmation that the reset email message was sent
      const json = await response.json();

      if (!response.ok) {
         console.log(json.error)
         setError(json.error)
         setResetPasswordEmailSent(false);
      };

      if (response.ok) {
         setError(null)
         setResetPasswordEmailSent(true);
      };

      setIsLoading(false);
   };

   return { resetPassword, error, isLoading, resetPasswordEmailSent };
};
