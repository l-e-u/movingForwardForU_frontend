import { useState } from 'react';

// hooks
import { useAuthContext } from './useAuthContext';
import { useJobsContext } from './useJobsContext';

export const useCreateArchive = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { user } = useAuthContext();
   const { dispatch } = useJobsContext();

   const archiveJob = async (job) => {
      setIsLoading(true);

      // don't want to show the error if the user is trying to rectify, so null error at the start
      setError(null);

      const receipt = {
         amendments: [],
         createdBy: job.createdBy.firstName + ' ' + job.createdBy.lastName,
         createdOn: new Date(job.createdAt),
         drivers: job.drivers.map(driver => ({ name: driver.firstName + ' ' + driver.lastName, email: driver.email })),
         reference: job.reference || '',
         parcel: job.parcel || '',
         organization: job.customer.organization,
         mileage: Number(job.mileage),
         delivery: { address: job.delivery.address, date: new Date(job.delivery.date), includeTime: job.delivery.includeTime },
         pickup: { address: job.pickup.address, date: new Date(job.pickup.date), includeTime: job.pickup.includeTime },
         notes: job.notes.map(note => {
            return {
               attachments: note.attachments,
               createdBy: note.createdBy.firstName + ' ' + note.createdBy.lastName,
               createdOn: new Date(note.createdAt),
               message: note.message,
               subject: note.subject
            }
         }),
         billing: job.billing.map(bill => {
            const amountIsAdjusted = (bill.adjustedAmount !== null);
            return {
               feeName: bill.fee.name,
               baseAmount: bill.fee.amount,
               finalAmount: amountIsAdjusted ? bill.adjustedAmount : bill.fee.amount
            }
         })
      }

      const response = await fetch(`${API_BASE_URL}/api/archives`, {
         method: 'POST',
         body: JSON.stringify({ receipt, job_id: job._id }),
         headers: {
            'Authentication': `Bearer ${user.token}`, 'Content-Type': 'application/json'
         }
      });

      // expecting the newly created status
      const json = await response.json();

      if (!response.ok) {
         console.error(json);
         setError(json.error);
         setIsLoading(false);

         return false;
      };

      // when an archive is created, the job is deleted, and the job is returned
      if (response.ok) {
         setError(null);
         setIsLoading(false);

         dispatch({ type: 'DELETE_JOB', payload: json });
         return true;
      };
   };

   return { archiveJob, isLoading, error }
};