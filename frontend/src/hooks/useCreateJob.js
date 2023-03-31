import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useCreateJob = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user } = useAuthContext();

    const createJob = async (job) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        // create a multipart form data object to send to server
        const form = new FormData();
        form.append('job', JSON.stringify(job));

        // this will hold the attachments which middleware will upload on the backend
        job.notes.forEach(note => {
            note.attachments.forEach(attachment => form.append('attachments', attachment.file));
        });

        const response = await fetch('/api/jobs', {
            method: 'POST',
            body: form,
            headers: { 'Authentication': `Bearer ${user.token}` }
        });

        // expecting the newly created status
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
            return true;
        };
    };

    return { createJob, isLoading, error, setError };
};