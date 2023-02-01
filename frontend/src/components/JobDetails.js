import { useJobsContext } from "../hooks/useJobsContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const JobDetails = ({ job }) => {
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const { from } = job;
    const { to } = job;
    const fromAddress = `${from.street1} ${from.street2} ${from.city}, ${from.state.toUpperCase()} ${from.zipcode}`;
    const toAddress = `${to.street1} ${to.street2} ${to.city}, ${to.state.toUpperCase()} ${to.zipcode}`;

    const handleClick = async () => {
        if (!user) return;

        const response = await fetch('http://localhost:4000/api/jobs/' + job._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_JOB', payload: json })
        };
    };

    return (
        <div className='job-details'>
            <h4>{job.status.name}</h4>
            <h5>{job.customer.organization}</h5>
            <p><strong>From: </strong> {fromAddress}</p>
            <p><strong>To: </strong> {toAddress}</p>
            <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
        </div>
    )
}

export default JobDetails;