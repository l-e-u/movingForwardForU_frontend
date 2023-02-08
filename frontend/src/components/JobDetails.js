import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import TransportInfo from "./TransportInfo.js";
import LogHistory from "./LogHistory.js";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const JobDetails = ({ job }) => {
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const handleDelete = async () => {
        if (!user) return;

        const response = await fetch('http://localhost:4000/api/jobs/' + job._id, {
            method: 'DELETE',
            headers: {
                'Authentication': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_JOB', payload: json })
        };
    };

    return (
        <div>
            <h5 className='text-primary'>{job.status.name}</h5>
            <h6>{job.customer.organization}</h6>
            <TransportInfo
                legend='From'
                {...job.pickup}
            />
            <TransportInfo
                legend='To'
                {...job.delivery}
            />

            <LogHistory logs={job.logs} />
            <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
            <i
                className="bi bi-trash3-fill"
                onClick={handleDelete}
            >

            </i>
        </div>
    )
}

export default JobDetails;