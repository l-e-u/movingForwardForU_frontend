import { useAuthContext } from "./useAuthContext";
import { useJobsContext } from "./useJobsContext";
import { useContactsContext } from "./useContactsContext";
import { useStatusesContext } from "./useStatusesContext";
import { useUsersContext } from "./useUsersContext";
import { useMyJobsContext } from "./useMyJobsContext";
import { useFeesContext } from './useFeesContext';

// sets the user to null
export const useLogout = () => {
   const { dispatch: authDispatch } = useAuthContext();
   const { dispatch: jobsDispatch } = useJobsContext();
   const { dispatch: myJobsDispatch } = useMyJobsContext();
   const { dispatch: contactsDispatch } = useContactsContext();
   const { dispatch: statusesDispatch } = useStatusesContext();
   const { dispatch: usersDispatch } = useUsersContext();
   const { dispatch: feesDispatch } = useFeesContext();

   const logout = () => {
      // remove user form storage
      localStorage.removeItem('token');

      // dispatch the logout action
      authDispatch({ type: 'LOGOUT' });

      // logging out dipatches all other contexts and sets to null
      jobsDispatch({ type: 'SET_JOBS', payload: null });
      myJobsDispatch({ type: 'SET_MYJOBS', payload: null });
      contactsDispatch({ type: 'SET_CONTACTS', payload: null });
      statusesDispatch({ type: 'SET_STATUSES', payload: null });
      usersDispatch({ type: 'SET_USERS', payload: null });
      feesDispatch({ type: 'SET_FEES', payload: null });
   };

   return { logout };
};