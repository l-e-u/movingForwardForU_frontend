import { useAuthContext } from "../hooks/useAuthContext.js"

const StatusDetails = ({ status }) => {
    const { user } = useAuthContext();

    return (
        <div className="details shadow">
            <p><strong>Name: </strong>{status.name}</p>
            <p><strong>Description: </strong>{status.description}</p>
        </div>
    );
};

export default StatusDetails;