import { useEffect, useState } from 'react';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';

const ContactSearchSelect = ({ customer, setJob, inputError, inputErrorMessage }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { contacts, dispatch } = useContactsContext();

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   const hasSelected = !!customer;

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            headers: {
               'Content-Type': 'application/json',
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
            dispatch({ type: 'SET_CONTACTS', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   if (hasSelected) {
      return (
         <CancellableOption
            handleCancelOnClick={() => {
               setJob(prev => {
                  const updated = { ...prev };
                  updated.customer = null;
                  return updated;
               });
            }}
            label='Customer'
            value={customer.organization}
         />
      );
   };


   return (
      <AutoCompleteSelect
         labelText='Customer'
         isRequired={true}
         setJob={setJob}
         getListedItemText={value => value.organization}
         filterSuggestions={(contactDoc, text) => contactDoc.organization.toLowerCase().includes(text)}
         inputError={inputError}
         inputErrorMessage={inputErrorMessage}
         documents={contacts ?? []}
         errorLoading={error}
         isLoading={isLoading}
         handleOnClickListItem={selectedContact => {
            return () => {
               setJob(prev => {
                  const updated = { ...prev };
                  // loop throught the contact's default fees, and the default fee is not already listed in the job's billing, then push it
                  selectedContact.defaultFees.forEach(defaultFee => {
                     if (!updated.billing.find(bill => defaultFee._id === bill._id)) updated.billing.push({ overrideAmount: null, fee: defaultFee });
                  })
                  updated.customer = selectedContact;
                  return updated;
               });
            };
         }}
      />
   );
};

export default ContactSearchSelect;