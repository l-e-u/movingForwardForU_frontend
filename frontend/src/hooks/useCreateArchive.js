import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useCreateArchive = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { user } = useAuthContext();

    const archiveJob = async (job) => {
        setIsLoading(true);

        // don't want to show the error if the user is trying to rectify, so null error at the start
        setError(null);

        const archivedJob = {
            createdBy: job.createdBy.firstName + ' ' + job.createdBy.lastName,
            createdOn: new Date(job.createdAt).toString(),
            reference: job.reference,
            parcel: job.parcel,
            organization: job.customer.organization,
            mileage: Number(job.mileage),
            delivery: { ...job.delivery },
            pickup: { ...job.pickup },
            notes: job.notes.map(note => {
                return {
                    attachments: note.attachments,
                    createdBy: note.createdBy.firstName + ' ' + note.createdBy.lastName,
                    createdOn: new Date(note.createdAt).toString(),
                    message: note.message,
                    subject: note.subject
                }
            }),
            billing: job.billing.map(bill => {
                const amountIsAdjusted = !!bill.adjustAmount;
                return {
                    feeName: bill.fee.name,
                    baseAmount: bill.fee.amount,
                    finalAmount: amountIsAdjusted ? bill.adjustAmount : bill.fee.amount
                }
            })
        }
        return console.log(archivedJob)
        const response = await fetch('/api/archives', {
            method: 'POST',
            body: JSON.stringify(archivedJob),
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

    return { archiveJob, isLoading, error }
};