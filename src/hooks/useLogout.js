import { useAuthContext } from "./useAuthContext";
import { useJobsContext } from "./useJobsContext";
import { useContactsContext } from "./useContactsContext";
import { useStatusesContext } from "./useStatusesContext";
import { useUsersContext } from "./useUsersContext";
import { useMyJobsContext } from "./useMyJobsContext";
import { useFeesContext } from './useFeesContext';
import { useArchivesContext } from './useArchiveContext';

// sets the user to []
export const useLogout = () => {
   const { dispatch: authDispatch } = useAuthContext();
   const { dispatch: jobsDispatch } = useJobsContext();
   const { dispatch: myJobsDispatch } = useMyJobsContext();
   const { dispatch: contactsDispatch } = useContactsContext();
   const { dispatch: statusesDispatch } = useStatusesContext();
   const { dispatch: usersDispatch } = useUsersContext();
   const { dispatch: feesDispatch } = useFeesContext();
   const { dispatch: archivesDispatch } = useArchivesContext();

   const logout = () => {
      // remove user form storage
      localStorage.removeItem('token');

      // dispatch the logout action
      authDispatch({ type: 'LOGOUT' });

      // logging out dipatches all other contexts and sets to []
      jobsDispatch({ type: 'SET_JOBS', payload: [] });
      myJobsDispatch({ type: 'SET_MYJOBS', payload: [] });
      contactsDispatch({ type: 'SET_CONTACTS', payload: [] });
      statusesDispatch({ type: 'SET_STATUSES', payload: [] });
      usersDispatch({ type: 'SET_USERS', payload: [] });
      feesDispatch({ type: 'SET_FEES', payload: [] });
      archivesDispatch({ type: 'SET_ARCHIVES', payload: [] });
   };

   return { logout };
};