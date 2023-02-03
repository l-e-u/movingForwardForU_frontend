import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useStatusesContext } from "../hooks/useStatusesContext.js";
import StatusDetails from "../components/StatusDetails.js";

const Statuses = () => {
    const { statuses, dispatch } = useStatusesContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchStatuses = async () => {
            const response = await fetch('http://localhost:4000/api/statuses', {
                headers: {
                    'Authentication': `Bearer ${user.token}`
                }
            });

            // expecting all the statuses
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STATUSES', payload: json });
            };
        };

        if (user) fetchStatuses();
    }, [dispatch, user]);

    return (
        <div className="statuses">
            {statuses && statuses.map((status) => {
                return <StatusDetails key={status._id} status={status} />
            })}
        </div>
    );
};

export default Statuses;