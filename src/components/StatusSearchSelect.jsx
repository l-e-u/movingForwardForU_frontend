import { useEffect, useState } from 'react';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';

// hooks
import { useStatusesContext } from '../hooks/useStatusesContext';
import { useAuthContext } from '../hooks/useAuthContext';

const StatusSearchSelect = ({ status, setJob, inputError, inputErrorMessage }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const { user } = useAuthContext();
   const { statuses, dispatch } = useStatusesContext();

   const hasSelected = !!status;

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/statuses`, {
            headers: {
               'Authentication': `Bearer ${user.token}`
            }
         });

         // expecting all contacts
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setError(null);
            setIsLoading(false);

            dispatch({ type: 'SET_STATUSES', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   if (hasSelected) {
      return (
         <CancellableOption
            handleCancelOnClick={() => {
               setJob(prev => {
                  const updated = { ...prev };
                  updated.status = null;
                  return updated;
               });
            }}
            label='Status'
            value={status.name}
         />

      );
   };

   return (
      <AutoCompleteSelect
         labelText='Status'
         isRequired={true}
         setJob={setJob}
         handleOnClickListItem={doc => {
            return () => {
               setJob(prev => {
                  const updated = { ...prev };
                  updated.status = doc;
                  return updated;
               });
            };
         }}
         getListedItemText={value => value.name}
         filterSuggestions={(stautusDoc, text) => stautusDoc.name.toLowerCase().includes(text)}
         inputError={inputError}
         inputErrorMessage={inputErrorMessage}
         documents={statuses ?? []}
         errorLoading={error}
         isLoading={isLoading} />
   );
};

export default StatusSearchSelect;