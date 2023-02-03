import { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useUserContext } from '../hooks/useUserContext.js';
import UserDetails from '../components/UserDetails.js'

const Users = () => {
    const { users, dispatch } = useUserContext();
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
                dispatch({ type: 'SET_CONTACTS', payload: json });
            };
        };

        if (user) fetchUsers();
    }, [dispatch, user]);

    return (
        <div className="contacts">
            {users && users.map((user) => {
                return <UserDetails key={user._id} contact={user} />
            })}
        </div>
    );
};

export default Users;