import { useState } from 'react'
import { useAuthContext } from './useAuthContext';
import { useJobsContext } from './useJobsContext';

export const useUpdateJob = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const updateJob = async ({ _id, updates, filesToDelete }) => {
        setIsLoading(true);
        setError(null);

        // create a multipart form data object to hold the updated fields
        const form = new FormData();
        form.append('updates', JSON.stringify(updates));

        // gather all the new notes that have attachments to upload
        updates.notes?.forEach(note => {
            // middleware handles this form data on the backend, no need to stringify
            note.attachments.forEach(attachment => form.append('attachments', attachment.file));
        });

        // append to formData all the previous uploads that need to be deleted with its note
        form.append('filesToDelete', JSON.stringify(filesToDelete));


        const response = await fetch('/api/jobs/' + _id, {
            method: 'PATCH',
            body: form,
            headers: { 'Authentication': `Bearer ${user.token}` }
        });

        // expecting the updated job doc
        const json = await response.json();

        if (!response.ok) {
            console.error(json);

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