import { useState } from 'react';

export const useResetPassword = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const resetPassword = async (email) => {
      setIsLoading(true);

      // don't want to show the error if user is trying to rectify, so null error at the start
      setResetPasswordEmailSent(false);

      const response = await fetch(`${API_BASE_URL}/api/users/resetPassword`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email }),
      });

      // expecting confirmation that the reset email message was sent
      const json = await response.json();

      if (!response.ok) {
         console.log('error')
         setResetPasswordEmailSent(false);
      };

      if (response.ok) {
         setResetPasswordEmailSent(true);
      };

      setIsLoading(false);
   };

   return { resetPassword, isLoading, resetPasswordEmailSent };
};
