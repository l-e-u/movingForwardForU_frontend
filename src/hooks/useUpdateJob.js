import { useState } from 'react'

// context
import { useAuthContext } from './useAuthContext';
import { useJobsContext } from './useJobsContext';

export const useUpdateJob = () => {
   const API_BASE_URL = process.env.API_BASE_URL;

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { user } = useAuthContext();
   const { dispatch } = useJobsContext();

   const updateJob = async ({ _id, filesToDelete, updates }) => {
      setIsLoading(true);
      setError(null);

      // format the updates into a new form to send in response
      const form = new FormData();

      form.append('updates', JSON.stringify(updates));

      if (filesToDelete) form.append('filesToDelete', JSON.stringify(filesToDelete));

      // if there's notes, check the first one (new notes are added at the start), and append the files for upload
      if (updates.notes && !updates.notes[0].hasOwnProperty('_id')) {
         updates.notes[0].attachments.forEach(attachment => form.append('attachments', attachment.file));
      };

      const response = await fetch(`${API_BASE_URL}/api/jobs/` + _id, {
         method: 'PATCH',
         body: form,
         headers: { 'Authentication': `Bearer ${user.token}` }
      });

      // expecting the updated job doc
      const json = await response.json();

      if (!response.ok) {
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      if (response.ok) {
         setError(null);
         setIsLoading(false);
         dispatch({ type: 'UPDATE_JOB', payload: json });

         return true;
      };
   };
   return { updateJob, isLoading, error, setError };
};