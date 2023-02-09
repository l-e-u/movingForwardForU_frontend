import { useAuthContext } from "./useAuthContext.js";
import { useJobsContext } from "./useJobsContext.js";
import { useContactsContext } from "./useContactsContext.js";
import { useStatusesContext } from "./useStatusesContext.js";
import { useUsersContext } from "./useUsersContext.js";
import { useMyJobsContext } from "./useMyJobsContext.js";

// sets the user to null
export const useLogout = () => {
    const { dispatch: authDispatch } = useAuthContext();
    const { dispatch: jobsDispatch } = useJobsContext();
    const { dispatch: myJobsDispatch } = useMyJobsContext();
    const { dispatch: contactsDispatch } = useContactsContext();
    const { dispatch: statusesDispatch } = useStatusesContext();
    const { dispatch: usersDispatch } = useUsersContext();

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
    };

    return { logout };
};