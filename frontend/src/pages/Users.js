import { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useUsersContext } from '../hooks/useUsersContext.js';
import UserDetails from '../components/UserDetails.js'

const Users = () => {
    const { users, dispatch } = useUsersContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:4000/api/users', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all the contacts
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USERS', payload: json });
            };
        };

        if (user) fetchUsers();
    }, [dispatch, user]);

    return (
        <div className="users">
            {users && users.map((u) => {
                return <UserDetails key={u._id} user={u} />
            })}
        </div>
    );
};

export default Users;